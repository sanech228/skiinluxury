import axios from "axios";
import * as cheerio from 'cheerio';
import Store from 'electron-store';
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs';
import fs from 'node:fs/promises';
import { sep } from 'node:path';


Store.initRenderer();

export const useScraper = (sender: any, db: any, dbPath: string, saveDir) => {
    const store = new Store();
    async function countHomes($loops = 12) {
        //@ts-ignore
        const ids = store.get('extracted') || [];
        //@ts-ignore
        const urltoextract = store.get('urltoextract') || '';
        const dataurl = `https://www.skiinluxury.com/chalets/search/limit:${$loops}?referer=resort_chalets&resortName[]=${urltoextract}`;

        sender.send('loading', true);
        const { data } = await axios.get(dataurl);
        const $ = cheerio.load(data);
        const CheerioItems = $('div.col-sm-6.col-xxl-4.col-xxxl-3');
        const items: any = CheerioItems.toArray();
        sender.send('set-found', items.length); 
        sender.send('loading', false);
    }   
    async function getAllLinks($loops = 12) {
        //@ts-ignore
        const ids = store.get('extracted') || [];

        //@ts-ignore
        const urltoextract = store.get('urltoextract') || null;
        var dataurl
        if(ids.length > 0) {
            dataurl = `https://www.skiinluxury.com/chalets/search/limit:${$loops}?referer=resort_chalets&resortName[]=${urltoextract}&loadmore_seen=${ids.join(',')}`;
        } else {
            dataurl = `https://www.skiinluxury.com/chalets/search/limit:${$loops}?referer=resort_chalets&resortName[]=${urltoextract}`;
        }
        //console.log('dataurl', dataurl);
        //@ts-ignore
        //const homes = store.get('homes') || [];
        //console.log('ids', ids);
        sender.send('loading', true);
        sender.send('status', 'Starting to process properties...');
        const { data } = await axios.get(dataurl);
        const $ = cheerio.load(data);
        const CheerioItems = $('div.col-sm-6.col-xxl-4.col-xxxl-3');
        const items: any = CheerioItems.toArray();
        
        let loopnum = 0;
        const extractedhomes = [];
        const extractedids = [];
        for (const value of items) {
            const id = $(value).attr('id');
            if(id && !ids.includes(id)) {
                loopnum++;
                const fullPath = saveDir + sep + id;
                const textfilename = fullPath + sep + 'item.txt';
                try {
                    mkdirSync(fullPath, { recursive: true });
                } catch (err) {
                    sender.send('status', `Error creating directory: ${err.message}`);
                    //console.log('Error creating directory', err.message);
                    continue;
                }

let textfile = `
{title} in {location}

{description}

Amenities:
{amenities}

Summary:
{summary}
`;
                const h = cheerio.load($(value).html());
                const url = h('a.chaletClick.active').attr('href');
                const name = h('h2.chalet-listing__title').text();
                sender.send('status', `Extracting ${name}`);
                sender.send('loop-status',`Extracting loop: ${loopnum}  out of ${$loops}`);
                const location = h('p.chalet-listing__location').text();
                const { data } = await axios.get(url);
                const itm = cheerio.load(data);
                //property-section
                const description_html = itm('section.chalet-section#property-section').html();
                const description = itm('section.chalet-section#property-section').text();

                const amenities = itm('div.chalet-features li').map(function() {
                    return $(this).text();
                }).get();
                const summary = itm('div.prices-include li').map(function() {
                    return $(this).text();
                }).get();
                
                textfile = textfile.replace('{title}', name);
                textfile = textfile.replace('{location}', location);
                textfile = textfile.replace('{description}', description);
                textfile = textfile.replace('{amenities}', amenities.join('\n'));
                textfile = textfile.replace('{summary}', summary.join('\n'));

                const newhome = {
                    id,
                    name,
                    url,
                    location,
                    status: null,
                    path: id,
                    title: name,
                    rates: [],
                    amenities,
                    description_html,
                    description,
                    summary,
                    images: [],
                    created: new Date().toLocaleString(),
                };


                const imgssss = itm('a.swiper-slide.chalet-hero__image-link').map(function() {
                    const imgurl    =  itm(this).attr('href');
                    let imgfilen    = imgurl.split('/').pop();
                    imgfilen        = newhome.path + imgfilen;
                    const imgpath   = fullPath + sep;
                    const photoimg  = fullPath + sep + imgfilen;


                    return {
                        url: imgurl,
                        path: imgpath,
                        filename: imgfilen,
                        photoimg,
                    };
                }).get();
                
                for (const img of imgssss) {
                    const { photoimg, url } = img;
                    if (!existsSync(photoimg)) {
                        try {
                            const response = await axios({ url, method: 'GET', responseType: 'stream', timeout: 5000 });
    
                            await new Promise((resolve, reject) => {
                                const writer = createWriteStream(photoimg);
                                response.data.pipe(writer);
                                writer.on('finish', () => resolve(true));
                                writer.on('error', (err) => reject(err));
                            });
                            //console.log('File downloaded and saved:', filename);
                            newhome.images.push(img);
                        } catch (err) {
                            //console.log('Error dl img', err.message);
                            continue;
                        }
                    } else {
                        //console.log('File already exists:', filename);
                        continue;
                    }
                }

                if(newhome.images.length > 0) {
                    try {
                        await fs.writeFile(textfilename, textfile);
                      } catch (err) {
                        console.log("textfilename " , err.message);
                    }
                    //console.log('newhome.images.length', newhome.images.length);
                    newhome.status = 'finished';
                    extractedids.push(id)
                    extractedhomes.push(newhome);
                    await db.insertTableContent('properties', dbPath, newhome, (succ: boolean, msg: string) => {
                        sender.send('status', `${name} | ${msg}`);
                        //console.log('insert: ', succ, msg);
                    });

                    await getFreshProperties();
                }
            }
        }
        //@ts-ignore
        store.set('extracted', extractedids); store.set('homes', extractedhomes)
        //@ts-ignore
        await getFreshProperties();
        sender.send('loading', false);
    }
    
    const deletehome = async (id, fullPath) => {
        db.deleteRow('properties', dbPath, {'id': id }, (succ, msg) => {
            rmSync(fullPath, { recursive: true, force: true });
            getFreshProperties();
        });
    }
    // Function to perform actions for each property link


    function getFreshProperties() {
        db.getAll('properties', dbPath, (succ: boolean, data: any) => {
            sender.send('properties-set', data);
        });
    }
    // Main function
    function init(properties = [], totalLoops = 0) {
        console.log('init', properties, totalLoops);
    }

    return {
        init,
        getAllLinks,
        countHomes,
    }
};




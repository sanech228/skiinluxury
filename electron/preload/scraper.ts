import axios from "axios";
import * as cheerio from 'cheerio';
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs';
import { sep } from 'node:path';


export const useScraper = (sender: any, db: any, dbPath: string, saveDir) => {
    async function getAllLinks() {
        sender.send('loading', true);
        sender.send('status', 'Starting to process properties...');
        const { data } = await axios.get('https://www.villagetaways.com/sitemap');
        const $ = cheerio.load(data);
        const links = $('h4 a');
        const count = links.length;
        sender.send('status', `Found ${count} links`);
        links.each((index, value) => {
            if($(value).attr('href').includes('.html')) {
                sender.send('status', 'Extracted ' + $(value).text());
                const linkObject = {
                    name: $(value).text(),
                    url: $(value).attr('href'),
                    status: null,
                    home: null,
                    created: new Date().toLocaleString(),
                };
                db.insertTableContent('properties', dbPath, linkObject, (succ: boolean, msg: string) => {
                    sender.send('status', `${$(value).text()} | ${msg}`);
                });
            }
            if(index === count - 1) {
                sender.send('loading', false);
                sender.send('status', 'Finished processing properties.');

                getFreshProperties();
            }
        });
    }
    const deletehome = async (id, fullPath) => {
        db.deleteRow('properties', dbPath, {'id': id }, (succ, msg) => {
            rmSync(fullPath, { recursive: true, force: true });
            getFreshProperties();
        });
    }
    // Function to perform actions for each property link
    async function processProperties(properties, loops) {
        sender.send('loading', true);
        var loop = 0;
        for (const prop of properties) {
            const fullPath = saveDir + sep + prop.id;

            if(prop.status === 'finished') {
                continue;
            }

            if(loop >= loops) {
                sender.send('loop-status',`Done extracting loop ${loop} out of ${loops}`);
                break;
            } else {
                sender.send('loop-status',`Extracting loop ${loop} out of ${loops}`);
            }


            if (existsSync(fullPath) && prop.status !== null) {
                sender.send('status', `Skipping ${prop.name} because it is already processed`);
                // console.log('Skipping ' + prop.id);
                continue;
            }
            if (existsSync(fullPath) && prop.status === null) {
                sender.send('status', `Deleting ${prop.name} because it is not processed`);
                //console.log('Deleting ' + prop.id);
                deletehome(prop.id, fullPath);
                continue;
            } else {
                try {
                    mkdirSync(fullPath, { recursive: true });
                } catch (err) {
                    sender.send('status', `Error creating directory: ${err.message}`);
                    // console.log('Error creating directory', err.message);
                    continue;
                }
            }

            try {
                sender.send('status', ` Processing property: ${prop.name}`);
                const { data } = await axios.get(prop.url);
                const $ = cheerio.load(data);
                const images = $('.slides#lightgallery a').map(function() {
                    return $(this).attr('href');
                }).get();
                if(images.length === 0) {
                    deletehome(prop.id, fullPath);
                    continue;
                }
                prop.home = {
                    path: prop.id,
                    url: prop.url,
                    title: $('title').text().replace('| VillaGetaways.com', '').trim(),
                    rates: [],
                    description: $('div.description').html(),
                    amenities: [],
                    summary: [],
                    photos: [],
                };

                $('ul.amenities li').each(function() {
                    prop.home.amenities.push($(this).text());
                });

                $('div.dates-list table tr').each(function() {
                    prop.home.rates.push($(this).text());
                });
                $('#villa-summary div strong').each(function() {
                    prop.home.summary.push($(this).text());
                });

                $('.slides#lightgallery a').map(async function() {
                    const url = $(this).attr('href');
                    let filename = url.split('/').pop();
                    filename = prop.home.path + filename;

                    prop.home.photos.push({
                        url,
                        path: fullPath + sep,
                        filename,
                    });

                    const photoimg = fullPath + sep + filename;

                    if (!existsSync(photoimg)) {
                        try {
                            const response = await axios({
                                url: url,
                                method: 'GET',
                                responseType: 'stream',
                                timeout: 5000, // Timeout in milliseconds
                            });

                            await new Promise((resolve, reject) => {
                                const writer = createWriteStream(photoimg);

                                response.data.pipe(writer);

                                writer.on('finish', () => {
                                    //sender.send('status', `Downloaded: ${filename} and saved to ${fullPath}`);
                                    // console.log('File downloaded and saved:', filename);
                                    resolve(true);
                                });

                                writer.on('error', (err) => {
                                    //sender.send('status', `Error saving ${filename}: ${err.message}`);
                                    // console.log('Error saving file', err.message);
                                    reject(err);
                                });
                            });
                        } catch (err) {
                            if (err.code === 'ECONNABORTED') {
                                sender.send('status', `Error downloading img ${filename}: Timeout reached`);
                            } else {
                                sender.send('status', `Error downloading img ${filename}: ${err.message}`);
                            }
                            // console.log('Error downloading', err.message);
                        }
                    }
                }).get();


                const { id, home } = prop;
                await new Promise((resolve, reject) => {
                    db.updateRow('properties', dbPath, { id }, { home, status: 'finished' }, (succ, msg) => {
                        sender.send('status', `Updated home for ${prop.name} with success? ${succ} - ${msg}`);
                        resolve(true);
                    });
                });

                loop++;
            } catch (err) {
                sender.send('status', `We have errors ${err.message} for ${prop.name} (${prop.id})`);
                //console.log('We have errors', err.message);
                //console.log('Home with problem: ', prop.id);
                await deletehome(prop.id, fullPath);

            } finally {
                getFreshProperties();
            }
        }

        getFreshProperties();
        sender.send('status', 'Finished processing properties.');
        sender.send('loading', false);
    }

    function getFreshProperties() {
        db.getAll('properties', dbPath, (succ: boolean, data: any) => {
            sender.send('properties-set', data);
        });
    }
    // Main function
    function init(properties, loops) {
        sender.send('loading', true);
        const propertiesDirPath = saveDir + sep;
        sender.send('status', `Savin photos to ${propertiesDirPath}`);
        if (properties.length > 0) {
            processProperties(properties, loops);
        } else {
            sender.send('status', 'no properties found');
            sender.send('loading', false);
        }
    }

    return {
        init,
        getAllLinks,
    }
};




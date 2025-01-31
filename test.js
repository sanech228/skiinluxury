import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import fs from 'node:fs';
import * as cheerio from 'cheerio';


const select = [
    {
      label: 'France',
      value: 'France',
      children: [
        { label: 'alpe-dhuez', value: 'https://www.skiinluxury.com/resorts/france/alpe-dhuez/luxury-chalet' },
        { label: 'argentiere', value: 'https://www.skiinluxury.com/resorts/france/argentiere/luxury-chalet' },
        { label: 'avoriaz', value: 'https://www.skiinluxury.com/resorts/france/avoriaz/luxury-chalet' },
        { label: 'chamonix', value: 'https://www.skiinluxury.com/resorts/france/chamonix/luxury-chalet' },
        { label: 'chatel', value: 'https://www.skiinluxury.com/resorts/france/chatel/luxury-chalet' },
        { label: 'courchevel', value: 'https://www.skiinluxury.com/resorts/france/courchevel-1850/luxury-chalet' },
        { label: 'courchevel-le-praz', value: 'https://www.skiinluxury.com/resorts/france/courchevel-le-praz/luxury-chalet' },
        { label: 'courchevel-moriond', value: 'https://www.skiinluxury.com/resorts/france/courchevel-moriond-1650/luxury-chalet' },
        { label: 'courchevel-village', value: 'https://www.skiinluxury.com/resorts/france/courchevel-village/luxury-chalet' },
        { label: 'la-clusaz', value: 'https://www.skiinluxury.com/resorts/france/la-clusaz/luxury-chalet' },
        { label: 'la-tania', value: 'https://www.skiinluxury.com/resorts/france/la-tania/luxury-chalet' },
        { label: 'les-arcs', value: 'https://www.skiinluxury.com/resorts/france/les-arcs/luxury-chalet' },
        { label: 'les-gets', value: 'https://www.skiinluxury.com/resorts/france/les-gets/luxury-chalet' },
        { label: 'megeve', value: 'https://www.skiinluxury.com/resorts/france/megeve/luxury-chalet' },
        { label: 'meribel', value: 'https://www.skiinluxury.com/resorts/france/meribel/luxury-chalet' },
        { label: 'morzine', value: 'https://www.skiinluxury.com/resorts/france/morzine/luxury-chalet' },
        { label: 'sainte-foy', value: 'https://www.skiinluxury.com/resorts/france/sainte-foy/luxury-chalet' },
        { label: 'samoens', value: 'https://www.skiinluxury.com/resorts/france/samoens/luxury-chalet' },
        { label: 'serre-chevalier', value: 'https://www.skiinluxury.com/resorts/france/serre-chevalier/luxury-chalet' },
        { label: 'st-gervais', value: 'https://www.skiinluxury.com/resorts/france/st-gervais/luxury-chalet' },
        { label: 'st-martin-de-belleville', value: 'https://www.skiinluxury.com/resorts/france/st-martin-de-belleville/luxury-chalet' },
        { label: 'tignes', value: 'https://www.skiinluxury.com/resorts/france/tignes/luxury-chalet' },
        { label: 'val-disere', value: 'https://www.skiinluxury.com/resorts/france/val-disere/luxury-chalet' },
        { label: 'val-thorens', value: 'https://www.skiinluxury.com/resorts/france/val-thorens/luxury-chalet' },
      ]
    },
    {
      label: 'Switzerland',
      value: 'Switzerland',
      children: [
        { label: 'andermatt', value: 'https://www.skiinluxury.com/resorts/switzerland/andermatt/luxury-chalet' },
        { label: 'crans-montana', value: 'https://www.skiinluxury.com/resorts/switzerland/crans-montana/luxury-chalet' },
        { label: 'davos', value: 'https://www.skiinluxury.com/resorts/switzerland/davos/luxury-chalet' },
        { label: 'grindelwald', value: 'https://www.skiinluxury.com/resorts/switzerland/grindelwald/luxury-chalet' },
        { label: 'gstaad', value: 'https://www.skiinluxury.com/resorts/switzerland/gstaad/luxury-chalet' },
        { label: 'klosters', value: 'https://www.skiinluxury.com/resorts/switzerland/klosters/luxury-chalet' },
        { label: 'nendaz', value: 'https://www.skiinluxury.com/resorts/switzerland/nendaz/luxury-chalet' },
        { label: 'saas-fee', value: 'https://www.skiinluxury.com/resorts/switzerland/saas-fee/luxury-chalet' },
        { label: 'st-moritz', value: 'https://www.skiinluxury.com/resorts/switzerland/st-moritz/luxury-chalet' },
        { label: 'verbier', value: 'https://www.skiinluxury.com/resorts/switzerland/verbier/luxury-chalet' },
        { label: 'zermatt', value: 'https://www.skiinluxury.com/resorts/switzerland/zermatt/luxury-chalet' },
      ]
    },
    {
      label: 'Austria',
      value: 'Austria',
      children: [
        { label: 'kitzbuhel', value: 'https://www.skiinluxury.com/resorts/austria/kitzbuhel/luxury-chalet' },
        { label: 'lech', value: 'https://www.skiinluxury.com/resorts/austria/lech/luxury-chalet' },
        { label: 'leogang', value: 'https://www.skiinluxury.com/resorts/austria/leogang/luxury-chalet' },
        { label: 'st-anton', value: 'https://www.skiinluxury.com/resorts/austria/st-anton/luxury-chalet' },
        { label: 'st-christoph', value: 'https://www.skiinluxury.com/resorts/austria/st-christoph/luxury-chalet' },
        { label: 'zurs', value: 'https://www.skiinluxury.com/resorts/austria/zurs/luxury-chalet' },
      ]
    },
    {
      label: 'Italy',
      value: 'Italy',
      children: [
        { label: 'alta-badia', value: 'https://www.skiinluxury.com/resorts/italy/alta-badia/luxury-chalet' },
        { label: 'arabba', value: 'https://www.skiinluxury.com/resorts/italy/arabba/luxury-chalet' },
        { label: 'brunico', value: 'https://www.skiinluxury.com/resorts/italy/brunico/luxury-chalet' },
        { label: 'canazei', value: 'https://www.skiinluxury.com/resorts/italy/canazei/luxury-chalet' },
        { label: 'cervinia', value: 'https://www.skiinluxury.com/resorts/italy/cervinia/luxury-chalet' },
        { label: 'cortina', value: 'https://www.skiinluxury.com/resorts/italy/cortina/luxury-chalet' },
        { label: 'livigno', value: 'https://www.skiinluxury.com/resorts/italy/livigno/luxury-chalet' },
        { label: 'madonna-di-campiglio', value: 'https://www.skiinluxury.com/resorts/italy/madonna-di-campiglio/luxury-chalet' },
        { label: 'ortisei', value: 'https://www.skiinluxury.com/resorts/italy/ortisei/luxury-chalet' },
        { label: 'selva-val-gardena', value: 'https://www.skiinluxury.com/resorts/italy/selva-val-gardena/luxury-chalet' },
        { label: 'sestriere', value: 'https://www.skiinluxury.com/resorts/italy/sestriere/luxury-chalet' },
      ]
    },
    {
      label: 'Canada',
      value: 'Canada',
        children: [
        { label: 'revelstoke', value: 'https://www.skiinluxury.com/resorts/canada/revelstoke/luxury-chalets' },
        { label: 'whistler', value: 'https://www.skiinluxury.com/resorts/canada/whistler/luxury-chalets' },
        ]
    },
    {
        label: 'Andorra',
        value: 'Andorra',
        children: [
        { label: 'soldeu', value: 'https://www.skiinluxury.com/resorts/andorra/soldeu/luxury-chalets' },
        ]
    }
];

const data = `
<div class="accordion-item">
    <h2 class="accordion-header" id="HomepageHeroSearch-flush-headingOne">
        <button class="accordion-button collapsed brand-font" type="button" data-bs-toggle="collapse" data-bs-target="#HomepageHeroSearch-flush-collapseOne" aria-expanded="false" aria-controls="HomepageHeroSearch-flush-collapseOne">
            France
        </button>
    </h2>
    <div id="HomepageHeroSearch-flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#HomepageHeroSearchAccordionDestinationHero">
        <div class="accordion-body">
            <ul class="list-unstyled p-o m-0">
                <li class="form-check form-switch mb-2">
                    <input type="checkbox" value="0" role="switch" id="HomepageHeroSearch-france-all" data-target=".all-france" data-parent="#HomepageHeroSearch" data-action="select" class="form-check-input multiple-toggle" />
                    <label for="HomepageHeroSearch-france-all" class="form-check-label"><strong>All France</strong></label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="18" id="HomepageHeroSearch-france-18" class="form-check-input all-france destination-checkbox mont-blanc" />
                    <label for="HomepageHeroSearch-france-18" class="form-check-label">Argentiere</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="14" id="HomepageHeroSearch-france-14" class="form-check-input all-france destination-checkbox mont-blanc" />
                    <label for="HomepageHeroSearch-france-14" class="form-check-label">Chamonix</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="31" id="HomepageHeroSearch-france-31" class="form-check-input all-france destination-checkbox portes-du-soleil" />
                    <label for="HomepageHeroSearch-france-31" class="form-check-label">Chatel</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="52" id="HomepageHeroSearch-france-52" class="form-check-input all-france destination-checkbox" />
                    <label for="HomepageHeroSearch-france-52" class="form-check-label">La Clusaz</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="20" id="HomepageHeroSearch-france-20" class="form-check-input all-france destination-checkbox portes-du-soleil" />
                    <label for="HomepageHeroSearch-france-20" class="form-check-label">Les Gets</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="50" id="HomepageHeroSearch-france-50" class="form-check-input all-france destination-checkbox mont-blanc" />
                    <label for="HomepageHeroSearch-france-50" class="form-check-label">Megeve</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="4" id="HomepageHeroSearch-france-4" class="form-check-input all-france destination-checkbox three-valleys" />
                    <label for="HomepageHeroSearch-france-4" class="form-check-label">Meribel</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="19" id="HomepageHeroSearch-france-19" class="form-check-input all-france destination-checkbox portes-du-soleil" />
                    <label for="HomepageHeroSearch-france-19" class="form-check-label">Morzine</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="26" id="HomepageHeroSearch-france-26" class="form-check-input all-france destination-checkbox" />
                    <label for="HomepageHeroSearch-france-26" class="form-check-label">Sainte Foy</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="53" id="HomepageHeroSearch-france-53" class="form-check-input all-france destination-checkbox" />
                    <label for="HomepageHeroSearch-france-53" class="form-check-label">Samoens</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="54" id="HomepageHeroSearch-france-54" class="form-check-input all-france destination-checkbox" />
                    <label for="HomepageHeroSearch-france-54" class="form-check-label">Serre Chevalier</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="36" id="HomepageHeroSearch-france-36" class="form-check-input all-france destination-checkbox mont-blanc" />
                    <label for="HomepageHeroSearch-france-36" class="form-check-label">St Gervais</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="33" id="HomepageHeroSearch-france-33" class="form-check-input all-france destination-checkbox three-valleys" />
                    <label for="HomepageHeroSearch-france-33" class="form-check-label">St Martin de Belleville</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="22" id="HomepageHeroSearch-france-22" class="form-check-input all-france destination-checkbox" />
                    <label for="HomepageHeroSearch-france-22" class="form-check-label">Tignes</label>
                </li>
                <li class="form-check">
                    <input type="checkbox" name="resortName[]" value="2" id="HomepageHeroSearch-france-2" class="form-check-input all-france destination-checkbox" />
                    <label for="HomepageHeroSearch-france-2" class="form-check-label">Val d'Isere</label>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="accordion-item">
    <h2 class="accordion-header" id="HomepageHeroSearch-flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#HomepageHeroSearch-flush-collapseTwo" aria-expanded="false" aria-controls="HomepageHeroSearch-flush-collapseTwo">
            Switzerland
        </button>
    </h2>
    <div id="HomepageHeroSearch-flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="HomepageHeroSearch-flush-headingTwo" data-bs-parent="#HomepageHeroSearchAccordionDestinationHero">
        <div class="accordion-body">
            <ul class="list-unstyled p-o m-0">
                <li class="form-check form-switch mb-2">
                    <input type="checkbox" value="0" role="switch" id="HomepageHeroSearch-switzerland-all" data-target=".all-switzerland" data-parent="#HomepageHeroSearch" data-action="select" class="form-check-input multiple-toggle" />
                    <label for="HomepageHeroSearch-switzerland-all" class="form-check-label"><strong>All Switzerland</strong></label>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="61" id="HomepageHeroSearch-switzerland-61" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-61" class="form-check-label">Crans Montana</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="77" id="HomepageHeroSearch-switzerland-77" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-77" class="form-check-label">Grindelwald</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="46" id="HomepageHeroSearch-switzerland-46" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-46" class="form-check-label">Gstaad</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="3" id="HomepageHeroSearch-switzerland-3" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-3" class="form-check-label">Klosters</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="67" id="HomepageHeroSearch-switzerland-67" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-67" class="form-check-label">Saas Fee</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="39" id="HomepageHeroSearch-switzerland-39" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-39" class="form-check-label">St Moritz</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="13" id="HomepageHeroSearch-switzerland-13" class="form-check-input all-switzerland four-valleys destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-13" class="form-check-label">Verbier</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="16" id="HomepageHeroSearch-switzerland-16" class="form-check-input all-switzerland destination-checkbox" />
                        <label for="HomepageHeroSearch-switzerland-16" class="form-check-label">Zermatt</label>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="accordion-item">
    <h2 class="accordion-header" id="HomepageHeroSearch-flush-headingThree">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#HomepageHeroSearch-flush-collapseThree" aria-expanded="false" aria-controls="HomepageHeroSearch-flush-collapseThree">
            Austria
        </button>
    </h2>
    <div id="HomepageHeroSearch-flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="HomepageHeroSearch-flush-headingThree" data-bs-parent="#HomepageHeroSearchAccordionDestinationHero">
        <div class="accordion-body">
            <ul class="list-unstyled p-o m-0">
                <li class="form-check form-switch mb-2">
                    <input type="checkbox" value="0" role="switch" id="HomepageHeroSearch-austria-all" data-target=".all-austria" data-parent="#HomepageHeroSearch" data-action="select" class="form-check-input multiple-toggle" />
                    <label for="HomepageHeroSearch-austria-all" class="form-check-label"><strong>All Austria</strong></label>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="94" id="HomepageHeroSearch-austria-94" class="form-check-input all-austria destination-checkbox" />
                        <label for="HomepageHeroSearch-austria-94" class="form-check-label">Kitzbuhel</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="88" id="HomepageHeroSearch-austria-88" class="form-check-input all-austria destination-checkbox" />
                        <label for="HomepageHeroSearch-austria-88" class="form-check-label">Lech</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="233" id="HomepageHeroSearch-austria-233" class="form-check-input all-austria destination-checkbox" />
                        <label for="HomepageHeroSearch-austria-233" class="form-check-label">Leogang</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="24" id="HomepageHeroSearch-austria-24" class="form-check-input all-austria destination-checkbox" />
                        <label for="HomepageHeroSearch-austria-24" class="form-check-label">St Anton</label>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="accordion-item">
    <h2 class="accordion-header" id="HomepageHeroSearch-flush-headingFour">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#HomepageHeroSearch-flush-collapseFour" aria-expanded="false" aria-controls="HomepageHeroSearch-flush-collapseFour">
            Italy
        </button>
    </h2>
    <div id="HomepageHeroSearch-flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="HomepageHeroSearch-flush-headingFour" data-bs-parent="#HomepageHeroSearchAccordionDestinationHero">
        <div class="accordion-body">
            <ul class="list-unstyled p-o m-0">
                <li class="form-check form-switch mb-2">
                    <input type="checkbox" value="0" role="switch" id="HomepageHeroSearch-italy-all" data-target=".all-italy" data-action="select" data-parent="#HomepageHeroSearch" class="form-check-input multiple-toggle" />
                    <label for="HomepageHeroSearch-italy-all" class="form-check-label"><strong>All Italy</strong></label>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="214" id="HomepageHeroSearch-italy-214" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-214" class="form-check-label">Alta Badia</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="227" id="HomepageHeroSearch-italy-227" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-227" class="form-check-label">Arabba</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="82" id="HomepageHeroSearch-italy-82" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-82" class="form-check-label">Brunico</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="226" id="HomepageHeroSearch-italy-226" class="form-check-input all-italy destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-226" class="form-check-label">Cervinia</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="93" id="HomepageHeroSearch-italy-93" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-93" class="form-check-label">Cortina</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="403" id="HomepageHeroSearch-italy-403" class="form-check-input all-italy destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-403" class="form-check-label">Livigno</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="370" id="HomepageHeroSearch-italy-370" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-370" class="form-check-label">Madonna di Campiglio</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="382" id="HomepageHeroSearch-italy-382" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-382" class="form-check-label">Ortisei</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="97" id="HomepageHeroSearch-italy-97" class="form-check-input all-italy dolomites destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-97" class="form-check-label">Selva Val Gardena</label>
                    </span>
                </li>
                <li>
                    <span class="form-check">
                        <input type="checkbox" name="resortName[]" value="386" id="HomepageHeroSearch-italy-386" class="form-check-input all-italy destination-checkbox" />
                        <label for="HomepageHeroSearch-italy-386" class="form-check-label">Sestriere</label>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>`;


const chalets = [];


const $ = cheerio.load(data);

const items = $('div.accordion-item').toArray();
for (let [ind, item] of items.entries()) {
  const lis = $(item).find('ul li').toArray();
   
  for (let [index, li] of lis.entries()) {
    if( $(li).hasClass('form-switch') ) {
      chalets[ind] = {
        label: $(li).find('label').text(),
        value: $(li).find('label').text(),
        children: []
      }
      console.log(lis.length, chalets[ind]);
      continue;
    } else if(chalets[ind] === undefined) {
      continue;
    } else {
      chalets[ind]['children'].push({
        label: $(li).find('label').text(),
        value: $(li).find('input').attr('value')
      })
    }
  }
}

fs.writeFile('./chalets.txt', JSON.stringify(chalets, null, 2), (err) => {
  if (err) {
    console.error(err);
  } else {
   
    console.error(' file written successfully');
  }
});

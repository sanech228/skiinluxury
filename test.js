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
    <h2 class="accordion-header m-0" id="flush-fixed-headingTwo">
       <button class="accordion-button collapsed" type="button" data-toggle="collapse" data-target="#flush-fixed-collapseTwo" aria-expanded="false" aria-controls="flush-fixed-collapseTwo">France</button>
    </h2>
    <div id="flush-fixed-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-fixed-headingTwo" data-parent="#accordionDestinationFixed">
       <div class="accordion-body">
          <ul class="list-unstyled p-o m-0">
             <li class="form-check form-switch mb-2">
                <input class="form-check-input multiple-toggle" type="checkbox" value="0" role="switch" id="france-fixed-all" data-target=".all-france" data-action="select">
                <label class="form-check-label" for="france-fixed-all"><strong>All France</strong></label>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="1" name="resortName[]" id="france-fixed-1" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-1">Alpe d'Huez</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="18" name="resortName[]" id="france-fixed-18" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-18">Argentiere</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="96" name="resortName[]" id="france-fixed-96" class="form-check-input all-france destination-checkbox  region-portes-du-soleil  ">
                <label class="form-check-label" for="france-fixed-96">Avoriaz</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="14" name="resortName[]" id="france-fixed-14" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-14">Chamonix</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="31" name="resortName[]" id="france-fixed-31" class="form-check-input all-france destination-checkbox  region-portes-du-soleil  ">
                <label class="form-check-label" for="france-fixed-31">Chatel</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="10" name="resortName[]" id="france-fixed-10" class="form-check-input all-france destination-checkbox region-three-valleys   region-courchevel">
                <label class="form-check-label" for="france-fixed-10">Courchevel 1850</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="35" name="resortName[]" id="france-fixed-35" class="form-check-input all-france destination-checkbox region-three-valleys   region-courchevel">
                <label class="form-check-label" for="france-fixed-35">Courchevel Le Praz</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="57" name="resortName[]" id="france-fixed-57" class="form-check-input all-france destination-checkbox region-three-valleys   region-courchevel">
                <label class="form-check-label" for="france-fixed-57">Courchevel Moriond</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="83" name="resortName[]" id="france-fixed-83" class="form-check-input all-france destination-checkbox region-three-valleys   region-courchevel">
                <label class="form-check-label" for="france-fixed-83">Courchevel Village</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="52" name="resortName[]" id="france-fixed-52" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-52">La Clusaz</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="32" name="resortName[]" id="france-fixed-32" class="form-check-input all-france destination-checkbox region-three-valleys   ">
                <label class="form-check-label" for="france-fixed-32">La Tania</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="27" name="resortName[]" id="france-fixed-27" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-27">Les Arcs</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="20" name="resortName[]" id="france-fixed-20" class="form-check-input all-france destination-checkbox  region-portes-du-soleil  ">
                <label class="form-check-label" for="france-fixed-20">Les Gets</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="50" name="resortName[]" id="france-fixed-50" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-50">Megeve</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="4" name="resortName[]" id="france-fixed-4" class="form-check-input all-france destination-checkbox region-three-valleys   ">
                <label class="form-check-label" for="france-fixed-4">Meribel</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="19" name="resortName[]" id="france-fixed-19" class="form-check-input all-france destination-checkbox  region-portes-du-soleil  ">
                <label class="form-check-label" for="france-fixed-19">Morzine</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="26" name="resortName[]" id="france-fixed-26" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-26">Sainte Foy</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="53" name="resortName[]" id="france-fixed-53" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-53">Samoens</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="54" name="resortName[]" id="france-fixed-54" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-54">Serre Chevalier</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="36" name="resortName[]" id="france-fixed-36" class="form-check-input all-france destination-checkbox    ">
                <label class="form-check-label" for="france-fixed-36">St Gervais</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="33" name="resortName[]" id="france-fixed-33" class="form-check-input all-france destination-checkbox region-three-valleys   ">
                <label class="form-check-label" for="france-fixed-33">St Martin de Belleville</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="22" name="resortName[]" id="france-fixed-22" class="form-check-input all-france destination-checkbox   region-killy ">
                <label class="form-check-label" for="france-fixed-22">Tignes</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="2" name="resortName[]" id="france-fixed-2" class="form-check-input all-france destination-checkbox   region-killy ">
                <label class="form-check-label" for="france-fixed-2">Val d'Isere</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="21" name="resortName[]" id="france-fixed-21" class="form-check-input all-france destination-checkbox region-three-valleys   ">
                <label class="form-check-label" for="france-fixed-21">Val Thorens</label>
                </span>
             </li>
          </ul>
       </div>
    </div>
    <!-- /#flush-fixed-collapseTwo -->
 </div>
 <!-- /.accordion-item -->	
 <div class="accordion-item">
    <h2 class="accordion-header m-0" id="flush-fixed-headingThree">
       <button class="accordion-button collapsed" type="button" data-toggle="collapse" data-target="#flush-fixed-collapseThree" aria-expanded="false" aria-controls="flush-fixed-collapseThree">Switzerland</button>
    </h2>
    <div id="flush-fixed-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-fixed-headingThree" data-parent="#accordionDestinationFixed">
       <div class="accordion-body">
          <ul class="list-unstyled m-0 p-0">
             <li class="form-check form-switch mb-2">
                <input class="form-check-input multiple-toggle" type="checkbox" value="0" role="switch" id="switzerland-fixed-all" data-target=".all-switzerland" data-action="select">
                <label class="form-check-label" for="switzerland-fixed-all"><strong>All Switzerland</strong></label>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="95" name="resortName[]" id="switzerland-fixed-95" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-95">Andermatt</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="61" name="resortName[]" id="switzerland-fixed-61" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-61">Crans Montana</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="28" name="resortName[]" id="switzerland-fixed-28" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-28">Davos</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="77" name="resortName[]" id="switzerland-fixed-77" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-77">Grindelwald</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="46" name="resortName[]" id="switzerland-fixed-46" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-46">Gstaad</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="3" name="resortName[]" id="switzerland-fixed-3" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-3">Klosters</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="59" name="resortName[]" id="switzerland-fixed-59" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-59">Nendaz</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="67" name="resortName[]" id="switzerland-fixed-67" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-67">Saas Fee</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="39" name="resortName[]" id="switzerland-fixed-39" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-39">St Moritz</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="13" name="resortName[]" id="switzerland-fixed-13" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-13">Verbier</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="16" name="resortName[]" id="switzerland-fixed-16" class="form-check-input all-switzerland destination-checkbox">
                <label class="form-check-label" for="switzerland-fixed-16">Zermatt</label>
                </span>
             </li>
          </ul>
       </div>
    </div>
    <!-- /#flush-fixed-collapseThree -->
 </div>
 <!-- /.accordion-item -->	
 <div class="accordion-item">
    <h2 class="accordion-header m-0" id="flush-fixed-headingFour">
       <button class="accordion-button collapsed" type="button" data-toggle="collapse" data-target="#flush-fixed-collapseFour" aria-expanded="false" aria-controls="flush-fixed-collapseFour">Austria</button>
    </h2>
    <div id="flush-fixed-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-fixed-headingFour" data-parent="#accordionDestinationFixed">
       <div class="accordion-body">
          <ul class="list-unstyled m-0 p-0">
             <li class="form-check form-switch mb-2">
                <input class="form-check-input multiple-toggle" type="checkbox" value="0" role="switch" id="austria-fixed-all" data-target=".all-austria" data-action="select">
                <label class="form-check-label" for="austria-fixed-all"><strong>All Austria</strong></label>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="94" name="resortName[]" id="austria-fixed-94" class="form-check-input all-austria destination-checkbox ">
                <label class="form-check-label" for="austria-fixed-94">Kitzbuhel</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="88" name="resortName[]" id="austria-fixed-88" class="form-check-input all-austria destination-checkbox region-arlberg">
                <label class="form-check-label" for="austria-fixed-88">Lech</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="233" name="resortName[]" id="austria-fixed-233" class="form-check-input all-austria destination-checkbox ">
                <label class="form-check-label" for="austria-fixed-233">Leogang</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="24" name="resortName[]" id="austria-fixed-24" class="form-check-input all-austria destination-checkbox region-arlberg">
                <label class="form-check-label" for="austria-fixed-24">St Anton</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="38" name="resortName[]" id="austria-fixed-38" class="form-check-input all-austria destination-checkbox region-arlberg">
                <label class="form-check-label" for="austria-fixed-38">St Christoph</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="68" name="resortName[]" id="austria-fixed-68" class="form-check-input all-austria destination-checkbox region-arlberg">
                <label class="form-check-label" for="austria-fixed-68">Zurs</label>
                </span>
             </li>
          </ul>
       </div>
    </div>
    <!-- /#flush-fixed-collapseFour -->
 </div>
 <!-- /.accordion-item -->	
 <div class="accordion-item">
    <h2 class="accordion-header m-0" id="flush-fixed-headingFive">
       <button class="accordion-button collapsed" type="button" data-toggle="collapse" data-target="#flush-fixed-collapseFive" aria-expanded="false" aria-controls="flush-fixed-collapseFive">Italy</button>
    </h2>
    <div id="flush-fixed-collapseFive" class="accordion-collapse collapse" aria-labelledby="flush-fixed-headingFive" data-parent="#accordionDestinationFixed">
       <div class="accordion-body">
          <ul class="list-unstyled m-0 p-0">
             <li class="form-check form-switch mb-2">
                <input class="form-check-input multiple-toggle" type="checkbox" value="0" role="switch" id="italy-fixed-all" data-target=".all-italy" data-action="select">
                <label class="form-check-label" for="italy-fixed-all"><strong>All Italy</strong></label>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="214" name="resortName[]" id="italy-fixed-214" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-214">Alta Badia</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="227" name="resortName[]" id="italy-fixed-227" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-227">Arabba</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="82" name="resortName[]" id="italy-fixed-82" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-82">Brunico</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="401" name="resortName[]" id="italy-fixed-401" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-401">Canazei</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="226" name="resortName[]" id="italy-fixed-226" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-226">Cervinia</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="93" name="resortName[]" id="italy-fixed-93" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-93">Cortina</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="403" name="resortName[]" id="italy-fixed-403" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-403">Livigno</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="370" name="resortName[]" id="italy-fixed-370" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-370">Madonna di Campiglio</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="382" name="resortName[]" id="italy-fixed-382" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-382">Ortisei</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="97" name="resortName[]" id="italy-fixed-97" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-97">Selva Val Gardena</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="386" name="resortName[]" id="italy-fixed-386" class="form-check-input all-italy destination-checkbox">
                <label class="form-check-label" for="italy-fixed-386">Sestriere</label>
                </span>
             </li>
          </ul>
       </div>
    </div>
    <!-- /#flush-fixed-collapseFive -->
 </div>
 <!-- /.accordion-item -->	
 <div class="accordion-item">
    <h2 class="accordion-header m-0" id="flush-fixed-headingSix">
       <button class="accordion-button collapsed" type="button" data-toggle="collapse" data-target="#flush-fixed-collapseSix" aria-expanded="false" aria-controls="flush-fixed-collapseSix">Canada</button>
    </h2>
    <div id="flush-fixed-collapseSix" class="accordion-collapse collapse" aria-labelledby="flush-fixed-headingSix" data-parent="#accordionDestinationFixed">
       <div class="accordion-body">
          <ul class="list-unstyled m-0 p-0">
             <li class="form-check form-switch mb-2">
                <input class="form-check-input multiple-toggle" type="checkbox" value="0" role="switch" id="canada-fixed-all" data-target=".all-canada" data-action="select">
                <label class="form-check-label" for="canada-fixed-all"><strong>All Canada</strong></label>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="86" name="resortName[]" id="canada-fixed-86" class="form-check-input all-canada destination-checkbox">
                <label class="form-check-label" for="canada-fixed-86">Revelstoke</label>
                </span>
             </li>
             <li>
                <span class="form-check">
                <input type="checkbox" value="220" name="resortName[]" id="canada-fixed-220" class="form-check-input all-canada destination-checkbox">
                <label class="form-check-label" for="canada-fixed-220">Whistler</label>
                </span>
             </li>
          </ul>
       </div>
    </div>
    <!-- /#flush-fixed-collapseSix -->
 </div>
 <!-- /.accordion-item -->	
 <div class="accordion-item">
    <h2 class="accordion-header m-0" id="flush-fixed-headingSeven">
       <button class="accordion-button collapsed" type="button" data-toggle="collapse" data-target="#flush-fixed-collapseSeven" aria-expanded="false" aria-controls="flush-fixed-collapseSeven">Andorra</button>
    </h2>
    <div id="flush-fixed-collapseSeven" class="accordion-collapse collapse" aria-labelledby="flush-fixed-headingSeven" data-parent="#accordionDestinationFixed">
       <div class="accordion-body">
          <ul class="list-unstyled m-0 p-0">
             <li>
                <span class="form-check">
                <input type="checkbox" value="384" name="resortName[]" id="andorra-fixed-384" class="form-check-input all-andorra destination-checkbox">
                <label class="form-check-label" for="andorra-fixed-384">Soldeu</label>
                </span>
             </li>
          </ul>
       </div>
    </div>
    <!-- /#flush-fixed-collapseSeven -->
 </div>
 <!-- /.accordion-item -->	
 </div><!-- /#accordionDestinationFixed -->
`;


const chalets = [];


const $ = cheerio.load(data);

const items = $('div.accordion-item').toArray();
for (let [ind, item] of items.entries()) {
  const lis = $(item).find('ul li').toArray();

  for (let [index, li] of lis.entries()) {
    if( $(li).hasClass('form-check') ) {
      chalets[ind] = {
        label: $(li).find('label').text(),
        value: $(li).find('label').text(),
        children: []
      }
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

// let count = 0;
// for (let [itemindex, item] of select.entries()) {
//   count++;
//     for (let [index, child] of item.children.entries()) {
        
//         select[itemindex].children[index].label = useChangeCase(child.label, 'capitalCase').value
//         console.log(select[itemindex].children[index].label)
//     }
// }

// console.log(count)

// const content = select;
// fs.writeFile('./text.txt', JSON.stringify(content), (err) => {
//   if (err) {
//     console.error(err);
//   } else {
   
//     console.error(' file written successfully');
//   }
// });
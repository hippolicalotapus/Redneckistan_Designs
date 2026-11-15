import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateCatalogue} from '../catalogue/catalogue.js';

// An evidence-gap assessment of the current development register, not an
// approval engine. Reassess these gaps when production evidence is recovered.
export function buildReadinessReport(catalogue,id='1-1'){
 validateCatalogue(catalogue);
 const product=catalogue.products.find(p=>p.id===id);
 if(!product)throw Error('Unknown design ID: '+id);
 if(product.group!=='mountain'||product.brand!=='One Heart')throw Error('Assessment supports One Heart mountain design slots only');
 const {approved,artworkVerified,supplierQuoteVerified,saleEnabled,priceCad}=product;
 const gaps=[
  ['garment','Assigned hoodie SKU, garment style, size/colour variants, fit and supplier availability'],
  ['artwork','Original production artwork master, rights evidence and individual design approval record'],
  ['dimensions','Confirmed front/back physical print dimensions and supplier decoration bounds; studio percentages are preview settings, not physical measurements'],
  ['quote','Itemized supplier quotation tied to this design, garment, decoration method and placement; original quotation attachment is not present here'],
  ['landed-cost','Verified complete landed cost including applicable fulfilment, shipping, size surcharges, setup allocation, tax and payment fees; no retail price is estimated'],
  ['sample-proof','Physical hoodie sample, print proof and recorded quality acceptance']
 ];
 return {
  design:{id:product.id,brand:product.brand,workingLabel:product.workingLabel,assessment:'hoodie',sku:null},
  catalogueState:{approved,artworkVerified,supplierQuoteVerified,saleEnabled,priceCad},
  notice:'Existing design slot assessed for a hoodie; not an approved SKU. Repository evidence-gap assessment only; external records may exist. Reassess when evidence is recovered.',
  missingEvidence:gaps.map(([category,needed])=>({category,status:'not evidenced in this repository',needed})),
  quoteContext:'The launch register records generic G&L hoodie rates, additional charges and estimated shipping, referencing an external quotation attachment. These notes are not a verified quote for this design or a complete landed cost. Lifted Press has no itemized quote recorded.',
  placementContext:'The project plan calls for small-front/large-back placement and tapered lines. The studio stores percent scale/coordinates and slogan text, not production specifications.',
  sources:['catalogue/launch-27.json','docs/27-design-launch-register.md','PROJECT_PLAN.md','studio/draft.js']
 };
}

function printReport(report){
 const lines=[
  'Offline hoodie readiness assessment',
  `${report.design.id} · ${report.design.brand} · ${report.design.workingLabel}`,
  report.notice,
  'Hoodie SKU: unassigned',
  '',
  ...Object.entries(report.catalogueState).map(([key,value])=>`${key}: ${String(value)}`),
  '',
  ...report.missingEvidence.map(gap=>`${gap.category}: ${gap.status}\n  Needed: ${gap.needed}`),
  '',
  'Supplier context: '+report.quoteContext,
  'Placement context: '+report.placementContext,
  '',
  'Repository sources:',...report.sources.map(path=>'  '+path)
 ];
 return lines.join('\n')+'\n';
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  if(process.argv.length>3)throw Error('Usage: npm run readiness -- [design-id]');
  const catalogue=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url),'utf8'));
  process.stdout.write(printReport(buildReadinessReport(catalogue,process.argv[2]??'1-1')));
 }catch(error){
  process.stderr.write('Readiness report: '+error.message+'\n');process.exitCode=1;
 }
}

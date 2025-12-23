
// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null; // 'esp' o 'cus'
const enableDeleteButton = false;   // true = activo, false = desactivado
const storageKey = 'records';
let estados = { 1: '', 2: '', 3: '' }; // 👈 estados de semáforos
// ======================
// AUXILIARES
// ======================
// ======================
// FUNCIONES AUXILIARES
// ======================
// ======================
// FUNCIONES AUXILIARES SEGURAS
// ======================

// Obtener valor de un input o textarea de forma segura
function get(id) {
    const el = document.getElementById(id);
    if (!el) return '';              // Si no existe, devuelve vacío
    if ('value' in el) return el.value.trim();  // Si tiene valor, devuelve value
    return '';                        // Si no tiene value, devuelve vacío
}

// Obtener estado de un checkbox de forma segura
function chk(id) {
    const el = document.getElementById(id);
    if (!el) return '0';              // Si no existe, devuelve 0
    return el.checked ? 1 : 0;   // Si existe, devuelve '1' o '0'
}
window.addEventListener('DOMContentLoaded', () => {
    resetSemaforos();
});
function resetSemaforos() {
    const selects = [
        'estado_ref',
        'estado_heat',
        'estado_elec',
        'resultado_servicio'
    ];

    selects.forEach(id => {
        const sel = document.getElementById(id);
        if (sel) sel.value = "";
    });
}

// Obtener valor de un grupo de radio buttons de forma segura
function estado(name) {
    const seleccionado = document.querySelector(`input[name="${name}"]:checked`);
    return seleccionado ? seleccionado.value : ''; // Si no hay ninguno seleccionado, devuelve vacío
}

// Obtener dataURL de canvas de forma segura
function getSignatureData(id) {
    const canvasElement = document.getElementById(id);
    if (canvasElement && canvasElement.tagName === 'CANVAS') {
        return canvasElement.toDataURL();
    }
    return '';
}


// ======================
// FOLIO AUTOMÁTICO
// ======================
function generateFolio(){
    const company = get('company') || 'SinEmpresa';
    const now = new Date();
    const y = now.getFullYear(), m = String(now.getMonth()+1).padStart(2,'0'), d = String(now.getDate()).padStart(2,'0');
    const h = String(now.getHours()).padStart(2,'0'), min = String(now.getMinutes()).padStart(2,'0');
    return `Diagnostic_Report-${company}-${y}${m}${d}-${h}${min}`;
}

// ======================
// GUARDAR REGISTRO (CAMPOS SEPARADOS POR COLUMNA)
// ======================
document.getElementById('saveBtn').addEventListener('click', () => {
const record = {


  // 1️⃣ DATOS DE CLIENTE
pay_order: get('pay_order'),
folio: generateFolio(),
OT: get('OT'),
datetime: get('datetime'),
company: get('company'),
engineer: get('engineer'),
phone: get('phone'),
city: get('city'),
// 2 DATOS DEL EQUIPO
description: get('description'),
brand: get('brand'),
model: get('model'),
serial: get('serial'),
controlnum: get('controlnum'),
status_test: get('status_test'),
// 3 CONDICIONES AMBIENTALES
ubication: get('ubication'),
temperature: get('temperature'),
humidity: get('humidity'),
// 4 CHEQUEO INICIAL
voltage_L1: get('voltage_L1'),
voltage_L2: get('voltage_L2'),
voltage_L3: get('voltage_L3'),
voltage_fase_to_neutral: get('voltage_fase_to_neutral'),
// 5 MEDICIONES
marking_ok: chk('marking_ok'),
voltage_plate_ok: chk('voltage_plate_ok'),
shock_free_ok: chk('shock_free_ok'),
pallets_ok: chk('pallets_ok'),
have_space_unpack_ok: chk('have_space_unpack_ok'),
supplies_installed_ok: chk('supplies_installed_ok'),
specs_available_ok: chk('specs_available_ok'),
has_refrigerant_ok: chk('has_refrigerant_ok'),
manuals_ok: chk('manuals_ok'),
// PRESIONES
static_hs: get('static_hs'),
static_ls: get('static_ls'),
// RESISTENCIA DE COMPRESORES TRIFÁSICOS
resistance_hs_rs: get('resistance_hs_rs'),
resistance_hs_rt: get('resistance_hs_rt'),
resistance_hs_st: get('resistance_hs_st'),
resistance_hs_to_ground: get('resistance_hs_to_ground'),
resistance_ls_rs: get('resistance_ls_rs'),
resistance_ls_rt: get('resistance_ls_rt'),
resistance_ls_st: get('resistance_ls_st'),
resistance_ls_to_ground: get('resistance_ls_to_ground'),
// RESISTENCIA DE COMPRESORES MONOFÁSICOS
resistance_comp_mono1_cr: get('resistance_comp_mono1_cr'),
resistance_comp_mono1_cs: get('resistance_comp_mono1_cs'),
resistance_comp_mono1_sr: get('resistance_comp_mono1_sr'),
resistance_comp_mono1_to_ground: get('resistance_comp_mono1_to_ground'),
resistance_comp_mono2_cr: get('resistance_comp_mono2_cr'),
resistance_comp_mono2_cs: get('resistance_comp_mono2_cs'),
resistance_comp_mono2_sr: get('resistance_comp_mono2_sr'),
resistance_comp_mono2_to_ground: get('resistance_comp_mono2_to_ground'),
// RESISTENCIA DE CALEFACTORES
resistance_heat1_rs: get('resistance_heat1_rs'),
resistance_heat1_rt: get('resistance_heat1_rt'),
resistance_heat1_st: get('resistance_heat1_st'),
resistance_heat1_to_ground: get('resistance_heat1_to_ground'),
resistance_heat2_rs: get('resistance_heat2_rs'),
resistance_heat2_rt: get('resistance_heat2_rt'),
resistance_heat2_st: get('resistance_heat2_st'),
resistance_heat2_to_ground: get('resistance_heat2_to_ground'),
resistance_heat3_rs: get('resistance_heat3_rs'),
resistance_heat3_rt: get('resistance_heat3_rt'),
resistance_heat3_st: get('resistance_heat3_st'),
resistance_heat3_to_ground: get('resistance_heat3_to_ground'),
// RESISTENCIA DE HEAD FANS
resistance_head1_fan: get('resistance_head1_fan'),
resistance_head2_fan: get('resistance_head2_fan'),
resistance_head1_2_fan_to_ground: get('resistance_head1_2_fan_to_ground'),
// RESISTENCIA DE HUMIDIFICADORES
resistance_hum1_rs: get('resistance_hum1_rs'),
resistance_hum1_to_ground: get('resistance_hum1_to_ground'),
resistance_hum2_rs: get('resistance_hum2_rs'),
resistance_hum2_to_ground: get('resistance_hum2_to_ground'),
// RESISTENCIA DE CIRCULADORES
resistance_circ1_rs: get('resistance_circ1_rs'),
resistance_circ1_rt: get('resistance_circ1_rt'),
resistance_circ1_st: get('resistance_circ1_st'),
resistance_circ1_to_ground: get('resistance_circ1_to_ground'),
resistance_circ2_rs: get('resistance_circ2_rs'),
resistance_circ2_rt: get('resistance_circ2_rt'),
resistance_circ2_st: get('resistance_circ2_st'),
resistance_circ2_to_ground: get('resistance_circ2_to_ground'),
resistance_circ3_rs: get('resistance_circ3_rs'),
resistance_circ3_rt: get('resistance_circ3_rt'),
resistance_circ3_st: get('resistance_circ3_st'),
resistance_circ3_to_ground: get('resistance_circ3_to_ground'),
// CONSUMO DE CORRIENTE DE COMPRESORES TRIFÁSICOS
current_hs_r: get ('current_hs_r'),
current_hs_s: get ('current_hs_s'),
current_hs_t: get ('current_hs_t'),
current_ls_r: get ('current_ls_r'),
current_ls_s: get ('current_ls_s'),
current_ls_t: get ('current_ls_t'),
// CONSUMO DE CORRIENTE DE COMPRESORES MONOFÁSICOS
current_hs_mono_c: get ('current_hs_mono_c'),
current_hs_mono_r: get ('current_hs_mono_r'),
current_ls_mono_c: get ('current_ls_mono_c'),
current_ls_mono_r: get ('current_ls_mono_r'),
current_headfan1_r: get('current_headfan1_r'),
current_headfan1_s: get('current_headfan1_s'),
current_headfan1_t: get('current_headfan1_t'),
// CONSUMO DE CORRIENTE DE HEAD FANS
current_headfan2_r: get('current_headfan2_r'),
current_headfan2_s: get('current_headfan2_s'),
current_headfan2_t: get('current_headfan2_t'),
// CONSUMO DE CORRIENTE DE MOTO-CONDENSADORES
current_cond1_fan_r: get('current_cond1_fan_r'),
current_cond1_fan_s: get('current_cond1_fan_s'),
current_cond1_fan_t: get('current_cond1_fan_t'),
current_cond2_fan_r: get('current_cond2_fan_r'),
current_cond2_fan_s: get('current_cond2_fan_s'),
current_cond2_fan_t: get('current_cond2_fan_t'),
current_cond3_fan_r: get('current_cond3_fan_r'),
current_cond3_fan_s: get('current_cond3_fan_s'),
current_cond3_fan_t: get('current_cond3_fan_t'),
// CONSUMO DE CORRIENTE DE CALEFACTORES
current_heat1_r: get('current_heat1_r'),
current_heat1_s: get('current_heat1_s'),
current_heat1_t: get('current_heat1_t'),
current_heat2_r: get('current_heat2_r'),
current_heat2_s: get('current_heat2_s'),
current_heat2_t: get('current_heat2_t'),
current_heat3_r: get('current_heat3_r'),
current_heat3_s: get('current_heat3_s'),
current_heat3_t: get('current_heat3_t'),
//  CONSUMO DE CORRIENTE DE CIRCULADORES
current_circ1_r: get('current_circ1_r'),
current_circ1_s: get('current_circ1_s'),
current_circ1_t: get('current_circ1_t'),
current_circ2_r: get('current_circ2_r'),
current_circ2_s: get('current_circ2_s'),
current_circ2_t: get('current_circ2_t'),
current_circ3_r: get('current_circ3_r'),
current_circ3_s: get('current_circ3_s'),
current_circ3_t: get('current_circ3_t'),
//  CONSUMO DE CORRIENTE DE HUMIDIFICADORES
current_hum1: get('current_hum1'),
current_hum2: get('current_hum2'),
//
voltage_plate: get('voltage_plate'),
voltage_of_control: get('voltage_of_control'),
voltaje_hs_r: get('voltaje_hs_r'),
voltaje_hs_s: get('voltaje_hs_s'),
voltaje_hs_t: get('voltaje_hs_t'),
voltaje_ls_r: get('voltaje_ls_r'),
voltaje_ls_s: get('voltaje_ls_s'),
voltaje_ls_t: get('voltaje_ls_t'),
//
main_switch_ok: chk('main_switch_ok'),
highvolt_cables_ok: chk('highvolt_cables_ok'),
switch_covers_ok: chk('switch_covers_ok'),
tighting_ok: chk('tighting_ok'),
headfan_ok: chk('headfan_ok'),
balance_ok: chk('balance_ok'),
fuses_ok: chk('fuses_ok'),
faseado_ok: chk('faseado_ok'),
crankcase_ok: chk('crankcase_ok'),
overloads_config_ok: chk('overloads_config_ok'),
grounded_ok: chk('grounded_ok'),
fans_ok: chk('fans_ok'),
coils_ok: chk('coils_ok'),
armafles_ok: chk('armafles_ok'),
injection_valve_ok: chk('injection_valve_ok'),
level_oi_ok: chk('level_oi_ok'),
sights_ok: chk('sights_ok'),
acid_ok: chk('acid_ok'),
hilow_protect_ok: chk('hilow_protect_ok'),
rotalocks_ok: chk('rotalocks_ok'),
capillaries_ok: chk('capillaries_ok'),
frosty_ok: chk('frosty_ok'),
channels_ok:chk('channels_ok'),
overcool_overtemp_ok: chk ('overcool_overtemp_ok'),
controller_calibrated_ok: chk('controller_calibrated_ok'),
sensors_ok: chk('sensors_ok'),
static_press_ok: chk('static_press_ok'),
temp_water_in_cond_ok: chk('temp_water_in_cond_ok'),
temp_water_out_cond_ok: chk('temp_water_out_cond_ok'),
press_water_in_cond_ok: chk('press_water_in_cond_ok'),
press_water_out_cond_ok: chk('press_water_out_cond_ok'),
temp_disch_hs_ok: chk('temp_disch_hs_ok'),
temp_disch_ls_ok: chk('temp_disch_ls_ok'),
bypass_cal_ok: chk('bypass_cal_ok'),
noleaks_ok: chk('noleaks_ok'),
hum_from: get('hum_from'),
heat_target: get('heat_target'),
heat_test_ok: chk('heat_test_ok'),
temp_hig: get('temp_hig'),
temp_low: get('temp_low'),
cold_test_ok: chk('cold_test_ok'),
pulldown: get('pulldown'),
hum_low: get('hum_low'),
hum_hig: get('hum_hig'),
hum_test_ok: chk('hum_test_ok'),
//
estado_elec: get('estado_elec'),
estado_heat: get('estado_heat'),
estado_ref: get('estado_ref'),
//
resultado_servicio: get('resultado_servicio'),
fail_work: get('fail_work'),
act_work: get('act_work'),
notes_Cus: get('notes_Cus'),
signaturePreviewCus: getSignatureData('signaturePreviewCus'),
notes_Esp: get('notes_Esp'),
signaturePreviewEsp: getSignatureData('signaturePreviewEsp'),
name_esp: get('name_esp'),
name_cus: get('name_cus'),
///////////
///////////
customer_suggestions: get('customer_suggestions'),
fin_work: get('fin_work'),
get_time_target: get('get_time_target'),
if_not_work: get('if_not_work'),
info_fail: get('info_fail'),
ini_work: get('ini_work'),
no_strange_noise_ok: chk('no_strange_noise_ok'),
part_change: get('part_change'),
pressures_hs_disch: get('pressures_hs_disch'),
pressures_hs_suction: get('pressures_hs_suction'),
pressures_ls_disch: get('pressures_ls_disch'),
pressures_ls_suction: get('pressures_ls_suction'),
protect_lowleveloil_ok: chk('protect_lowleveloil_ok'),
suggest_solution: get('suggest_solution'),
status: get('status')
};

  records.push(record);
  localStorage.setItem(storageKey, JSON.stringify(records));
  renderTable();
  alert('✅ Registro guardado correctamente');
});

// ======================
// LIMPIAR FORMULARIO
// ======================
document.getElementById('clearBtn').addEventListener('click', ()=>{
    document.getElementById('reportForm').reset();
    
    // Los clearRect deben estar dentro de un chequeo de existencia si los ID no son seguros
    const espCtx = document.getElementById('signaturePreviewEsp')?.getContext('2d');
    const cusCtx = document.getElementById('signaturePreviewCus')?.getContext('2d');
    if (espCtx) espCtx.clearRect(0,0,300,150);
    if (cusCtx) cusCtx.clearRect(0,0,300,150);
    resetSemaforos();
});
// ======================
// RENDER TABLA
// ======================
function renderTable(){
    const head = document.getElementById('tableHead');
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    const columns = [
'folio',
'OT',
'datetime',
'company',
'engineer',
'phone',
'city',
'description',
'brand',
'model',
'serial',
'controlnum',
'status_test',
'suggest_solution',
'ubication',
'temperature',
'humidity',
'static_ls',
'static_hs',
//RESISTENCIAS
'resistance_hs_rs',
'resistance_hs_rt',
'resistance_hs_st',
'resistance_hs_to_ground',
'resistance_ls_rs',
'resistance_ls_rt',
'resistance_ls_st',
'resistance_ls_to_ground',
'resistance_heat1_rs',
'resistance_heat1_rt',
'resistance_heat1_st',
'resistance_heat1_to_ground',
'resistance_heat2_rs',
'resistance_heat2_rt',
'resistance_heat2_st',
'resistance_heat2_to_ground',
'resistance_heat3_rs',
'resistance_heat3_rt',
'resistance_heat3_st',
'resistance_heat3_to_ground',
'resistance_hum1_rs',
'resistance_hum1_to_ground',
'resistance_hum2_rs',
'resistance_hum2_to_ground',
'resistance_circ1_rs',
'resistance_circ1_rt',
'resistance_circ1_st',
'resistance_circ1_to_ground',
'resistance_circ2_rs',
'resistance_circ2_rt',
'resistance_circ2_st',
'resistance_circ2_to_ground',
'resistance_circ3_rs',
'resistance_circ3_rt',
'resistance_circ3_st',
'resistance_circ3_to_ground',
//AMPERAJES
'current_hs_r',
'current_hs_s',
'current_hs_t',
'current_ls_r',
'current_ls_s',
'current_ls_t',
'current_hs_mono_c',
'current_hs_mono_r',
'current_ls_mono_c',
'current_ls_mono_r',
'current_circ1_r',
'current_circ1_s',
'current_circ1_t',
'current_circ2_r',
'current_circ2_s',
'current_circ2_t',
'current_circ3_r',
'current_circ3_s',
'current_circ3_t',
'current_headfan1_r',
'current_headfan1_s',
'current_headfan1_t',
'current_headfan2_r',
'current_headfan2_s',
'current_headfan2_t',
'current_cond1_fan_r',
'current_cond1_fan_s',
'current_cond1_fan_t',
'current_cond2_fan_r',
'current_cond2_fan_s',
'current_cond2_fan_t',
'current_cond3_fan_r',
'current_cond3_fan_s',
'current_cond3_fan_t',
'current_heat1_r',
'current_heat1_s',
'current_heat1_t',
'current_heat2_r',
'current_heat2_s',
'current_heat2_t',
'current_heat3_r',
'current_heat3_s',
'current_heat3_t',
'current_hum1',
'current_hum2',
'voltage_plate',
'voltage_of_control',
'voltaje_hs_r',
'voltaje_hs_s',
'voltaje_hs_t',
'voltaje_ls_r',
'voltaje_ls_s',
'voltaje_ls_t',
'pressures_hs_suction',
'pressures_hs_disch',
'pressures_ls_suction',
'pressures_ls_disch',
//
'voltage_L1',
'voltage_L2',
'voltage_L3',
'voltage_fase_to_neutral',
//
'marking_ok',
'voltage_plate_ok',
'shock_free_ok',
'pallets_ok',
'have_space_unpack_ok',
'supplies_installed_ok',
'specs_available_ok',
'has_refrigerant_ok',
'manuals_ok',
'overloads_config_ok',
'main_switch_ok',
'highvolt_cables_ok',
'switch_covers_ok',
'tighting_ok',
'headfan_ok',
'balance_ok',
'fuses_ok',
'faseado_ok',
'crankcase_ok',
'grounded_ok',
'fans_ok',
'coils_ok',
'armafles_ok',
'injection_valve_ok',
'protect_lowleveloil_ok',
'sights_ok',
'acid_ok',
'hilow_protect_ok',
'rotalocks_ok',
'capillaries_ok',
'frosty_ok',
'channels_ok',
'overcool_overtemp_ok',
'controller_calibrated_ok',
'sensors_ok',
'static_press_ok',
'temp_water_in_cond_ok',
'temp_water_out_cond_ok',
'press_water_in_cond_ok',
'press_water_out_cond_ok',
'temp_disch_hs_ok',
'temp_disch_ls_ok',
'bypass_cal_ok',
'hum_from',
'heat_target',
'heat_test_ok',
'temp_hig',
'temp_low',
'cold_test_ok',
'pulldown',
'hum_low',
'hum_hig',
'hum_test_ok',
'estado_ref',
'estado_heat',
'estado_elec',
'resultado_servicio',
'fail_work',
'act_work',
'noleaks_ok',
'notes_Cus',
'name_esp',
'name_cus',
'signaturePreviewCus',
'signaturePreviewEsp'
];
    
    head.innerHTML = columns.map(c => `<th>${c.toUpperCase().replace(/_/g, ' ')}</th>`).join('');
    
    records.forEach(r => {
        const row = `<tr>${columns.map(c => {
            let data = r[c] || '';
            
            if (Array.isArray(data)) {
                data = data.filter(val => val !== null && val !== undefined).join('<br>');
            }
            
            return `<td>${data}</td>`;
        }).join('')}</tr>`;
        
        body.insertAdjacentHTML('beforeend', row);
    });
}

renderTable();

// ======================
// EXPORTAR EXCEL
// ======================
document.getElementById('exportBtn').addEventListener('click', () => {
    if (!records.length) {
        alert('No hay registros para exportar.');
        return;
    }

    const folio = records[0].folio || 'SIN_FOLIO';
    const folioSeguro = String(folio).replace(/[\\/:*?"<>|]/g, '_');

    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes');

    XLSX.writeFile(wb, `${folioSeguro}.xlsx`);
});



// ======================
// BORRAR REGISTROS
// ======================
const deleteBtn = document.getElementById('deleteAllBtn');
deleteBtn.style.display = enableDeleteButton?'inline-block':'none';
deleteBtn.onclick = ()=>{
    if(!enableDeleteButton) return;
    if(confirm('¿Borrar todos los registros guardados?')){
        localStorage.removeItem(storageKey);
        records=[];
        renderTable();
    }
}

// ======================
// FIRMA
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function openSignature(target){
    currentSignatureTarget = target;
    modal.classList.add('active');
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

document.getElementById('openSignatureEsp').addEventListener('click',()=>openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click',()=>openSignature('cus'));

document.getElementById('closeSignature').addEventListener('click',()=>modal.classList.remove('active'));
document.getElementById('clearSignature').addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));
document.getElementById('saveSignature').addEventListener('click',()=>{
    const dataURL = canvas.toDataURL();
    let preview = currentSignatureTarget==='esp'?document.getElementById('signaturePreviewEsp'):document.getElementById('signaturePreviewCus');
    // Se agrega una verificación si 'preview' existe antes de obtener el contexto
    if (!preview) {
        console.error("No se encontró el canvas de vista previa para la firma.");
        modal.classList.remove('active');
        return;
    }
    
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload = ()=>{pctx.clearRect(0,0,300,150); pctx.drawImage(img,0,0,300,150)};
    img.src = dataURL;
    modal.classList.remove('active');
});

// ======================
// DIBUJO CANVAS
// ======================
const getTouchPos = (canvasDom, touchEvent) => {
    const rect = canvasDom.getBoundingClientRect();
    // Obtiene la posición del primer toque (touch) y ajusta por el scroll y la posición del canvas
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
};

// Eventos del Mouse
canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    drawing = true; 
    ctx.beginPath(); 
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => { drawing = false; });
canvas.addEventListener('mouseout', () => { drawing = false; });
canvas.addEventListener('mousemove', e => {
    if (!drawing) return; 
    ctx.lineWidth = 2; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = '#000'; 
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.stroke();
});

// Eventos Táctiles (para móviles)
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    drawing = true;
    const touch = getTouchPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(touch.x, touch.y);
}, false);

canvas.addEventListener('touchend', () => { drawing = false; });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drawing) return;
    const touch = getTouchPos(canvas, e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(touch.x, touch.y);
    ctx.stroke();
}, false);
const seccion = document.getElementById('section-headerx');

function verProximoServicio() {
  const seleccionado = document.querySelector('input[name="proximo_servicio"]:checked');
  const salida = document.getElementById('resultado_servicio');
  
  if (seleccionado) {
    salida.textContent = "Servicio sugerido: " + seleccionado.value;
  } else {
    salida.textContent = "⚠️ No se ha seleccionado ninguna opción.";
  }
}
document.getElementById('sendEmailBtn').addEventListener('click', () => {
  const to = "tck@olimp0.com";
  const subject = encodeURIComponent("Nuevo reporte de diagnóstico");

  const company = get('company');
  const folio = generateFolio('folio');
  const model = get('model');
  const serial = get('serial');
  const status = get('status_test');
  const notes = get('notes_Esp');

  // 💡 Usamos HTML con <br> para asegurar formato visible en BlueMail
  const htmlBody =
`Hola,<br><br>
Tienes un nuevo reporte de diagnóstico:<br><br>
<strong>Folio:</strong> ${folio}<br>
<strong>Empresa:</strong> ${company}<br>
<strong>Modelo:</strong> ${model}<br>
<strong>Serial:</strong> ${serial}<br>
<strong>Status:</strong> ${status}<br>
<strong>Notas:</strong> ${notes}<br><br>
Por favor, adjunta el archivo del registro antes de enviar.<br><br>
Gracias.`;

  // Codificamos todo el HTML como texto URL
  const body = encodeURIComponent(htmlBody);

  const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
});

// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null;
const enableDeleteButton = true;
const storageKey = 'records';

// ======================
// AUXILIARES
// ======================
function get(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function chk(id) {
  const el = document.getElementById(id);
  return el && el.checked ? 'Sí' : 'No';
}
function getSignatureData(id) {
  const canvasElement = document.getElementById(id);
  return canvasElement && canvasElement.tagName === 'CANVAS'
    ? canvasElement.toDataURL()
    : '';
}

// ======================
// FOLIO AUTOMÁTICO
// ======================
function generateFolio() {
  const company = get('company') || 'SinEmpresa';
  const now = new Date();
  const y = now.getFullYear(),
    m = String(now.getMonth() + 1).padStart(2, '0'),
    d = String(now.getDate()).padStart(2, '0'),
    h = String(now.getHours()).padStart(2, '0'),
    min = String(now.getMinutes()).padStart(2, '0');
  return `MC_Report-${company}-${y}${m}${d}-${h}${min}`;
}

  // GUARDAR REGISTRO
  document.getElementById('saveBtn').addEventListener('click', ()=>{
    const record = {
      folio: generateFolio(),
      OT: get('OT'),
      datetime: get('datetime'),
      company: get('company'),
      engineer: get('engineer'),
      phone: get('phone'),
      city: get('city'),
      description: get('description'),
      brand: get('brand'),
      model: get('model'),
      serial: get('serial'),
      controlnum: get('controlnum'),
      status: get('status'),
      ubication: get('ubication'),
      temperature: get('temperature'),
      humidity: get('humidity'),
      marking: chk('marking'),
      voltage_plate: chk('voltage_plate'),
      shock_free: chk('shock_free'),
      pallets: chk('pallets'),
      unpack: chk('unpack'),
      supplies_installed: chk('supplies_installed'),
      specs_available: chk('specs_available'),
      refrigerant: chk('refrigerant'),
      manuals: chk('manuals'),
      notes: get('notes'),
      name_esp: get('name_esp'),
      name_cus: get('name_cus'),
      // getSignatureData ahora verificará si está vacío
      signatureEsp: getSignatureData('signaturePreviewEsp'),
      signatureCus: getSignatureData('signaturePreviewCus'),
      static_ls: [get('static_ls')],
      static_hs: [get('static_hs')],
      resistance_hs: [get('resistance_hs_1'), get('resistance_hs_2'), get('resistance_hs_3')],
      resistance_ls: [get('resistance_ls_1'), get('resistance_ls_2'), get('resistance_ls_3')],
      resistance_circ: [get('resistance_circ_1'), get('resistance_circ_2'), get('resistance_circ_3')],
      resistance_heat: [get('resistance_heat_1'), get('resistance_heat_2'), get('resistance_heat_3')],
      resistance_hum: [get('resistance_hum_1'), get('resistance_hum_2'), get('resistance_hum_3')],
      voltaje_hs: [get('voltaje_hs_1'), get('voltaje_hs_2'), get('voltaje_hs_3')],
      voltaje_ls: [get('voltaje_ls_1'), get('voltaje_ls_2'), get('voltaje_ls_3')],
      to_ground: [get('to_ground')],
      current_hs: [get('current_hs_1'), get('current_hs_2'), get('current_hs_3')],
      current_ls: [get('current_ls_1'), get('current_ls_2'), get('current_ls_3')],
      current_circ: [get('current_circ_1'), get('current_circ_2'), get('current_circ_3')],
      current_heat: [get('current_heat_1'), get('current_heat_2'), get('current_heat_3')],
      current_hum: [get('current_hum_1'), get('current_hum_2'), get('current_hum_3')],
      pressures_hs: [get('pressures_hs_1'), get('pressures_hs_2')],
      pressures_ls: [get('pressures_ls_1'), get('pressures_ls_2')]
    };

    records.push(record);
    localStorage.setItem(storageKey, JSON.stringify(records));
    renderTable();
    alert('✅ Registro guardado correctamente');
  });

  // LIMPIAR FORMULARIO
  document.getElementById('clearBtn').addEventListener('click', ()=>{
    document.getElementById('reportForm').reset();
    // Lógica mejorada para limpiar los canvas
    ['signaturePreviewEsp','signaturePreviewCus'].forEach(id=>{
      const canvas = document.getElementById(id);
      const ctx = canvas?.getContext('2d');
      if(ctx && canvas) {
        // Limpia usando las dimensiones reales del canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  });

  // EXPORTAR EXCEL
  document.getElementById('exportBtn').addEventListener('click', ()=>{
    if(!records.length) return alert('No hay registros para exportar.');
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
    XLSX.writeFile(wb, 'Registro_de_arranques.xlsx');
  });

  // BORRAR REGISTROS
  const deleteBtn = document.getElementById('deleteAllBtn');
  deleteBtn.style.display = enableDeleteButton ? 'inline-block' : 'none';
  deleteBtn.onclick = ()=>{
    if(!enableDeleteButton) return;
    if(confirm('¿Borrar todos los registros guardados?')){
      localStorage.removeItem(storageKey);
      records=[];
      renderTable();
    }
  };

  // RENDER TABLA
  renderTable();
  
  // *** INICIALIZAR CANVAS DE FIRMAS ***
  // Esto activa la lógica de dibujo en ambos canvas
  initializeSignaturePad('signaturePreviewEsp');
  initializeSignaturePad('signaturePreviewCus');
  
}); // <-- FIN DEL DOMContentLoaded

// ======================
// RENDER TABLA
// ======================
function renderTable(){
  const head=document.getElementById('tableHead');
  const body=document.getElementById('tableBody');
  body.innerHTML='';

  const columns=[
    'folio','OT','datetime','company','engineer','phone','city','description',
    'brand','model','serial','controlnum','status','ubication','temperature','humidity',
    'marking','voltage_plate','shock_free','pallets','unpack','supplies_installed',
    'specs_available','refrigerant','manuals','notes','name_esp','name_cus','signatureEsp','signatureCus'
  ];

  head.innerHTML = columns.map(c=>`<th>${c.toUpperCase().replace(/_/g,' ')}</th>`).join('');

  records.forEach(r=>{
    const row = `<tr>${columns.map(c=>{
      let data = r[c] || '';
      // Si es una firma (URL Base64), mostramos una imagen pequeña
      if ((c === 'signatureEsp' || c === 'signatureCus') && data.startsWith('data:image')) {
        data = `<img src="${data}" alt="Firma" width="100" style="border:1px solid #ccc;">`;
      } else if (Array.isArray(data)) {
        data=data.filter(v=>v).join('<br>');
      }
      return `<td>${data}</td>`;
    }).join('')}</tr>`;
    body.insertAdjacentHTML('beforeend', row);
  });
}

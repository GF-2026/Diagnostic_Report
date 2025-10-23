// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null;
const enableDeleteButton = true;
const storageKey = 'records';
let estados = { 1: '', 2: '', 3: '' }; // 👈 estados de semáforos

// ======================
// AUXILIARES
// ======================
function get(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function chk(id) {
  return document.getElementById(id)?.checked ? 'Sí' : 'No';
}

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
function generateFolio() {
  const company = get('company') || 'SinEmpresa';
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `MC_Report-${company}-${y}${m}${d}-${h}${min}`;
}

// ======================
// GUARDAR REGISTRO
// ======================
document.getElementById('saveBtn').addEventListener('click', () => {
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
    status_test: get('status_test'),

    ubication: get('ubication'),
    temperature: get('temperature'),
    humidity: get('humidity'),
    
    info_fail:: get('info_fail'),
    status: get('status'),
    if_not_work: get('if_not_work'),
    part_change: get('part_change'),
    act_work: get('act_work'),
    ini_work: get('ini_work'),
    fin_work: get('fin_work'),
    heat_from: get('heat_from'),
    heat_target: get('heat_target'),
    heat_test: get('heat_test'),
    hum_low: get('hum_low'),
    hum_high: get('hum_high'),
    hum_test: get('hum_test'),
    temp_high: get('temp_high'),
    temp_low: get('temp_low'),
    cold_test: get('cold_test'),
    get_time_target: get('get_time_target'),
    pulldown: get('pulldown'),
    // === SEMÁFOROS ===
    estado_ref: estados[1],
    estado_heat: estados[2],
    estado_elec: estados[3],

    notes: get('notes'),
    name_esp: get('name_esp'),
    name_cus: get('name_cus'),
    signatureEsp: getSignatureData('signaturePreviewEsp'),
    signatureCus: getSignatureData('signaturePreviewCus'),
  };

  records.push(record);
  localStorage.setItem(storageKey, JSON.stringify(records));
  renderTable();
  alert('✅ Registro guardado correctamente');
});

// ======================
// LIMPIAR FORMULARIO
// ======================
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('reportForm').reset();

  const espCtx = document.getElementById('signaturePreviewEsp')?.getContext('2d');
  const cusCtx = document.getElementById('signaturePreviewCus')?.getContext('2d');
  if (espCtx) espCtx.clearRect(0, 0, 300, 150);
  if (cusCtx) cusCtx.clearRect(0, 0, 300, 150);

  // 🔄 Reset semáforos
  estados = { 1: '', 2: '', 3: '' };
  ['1','2','3'].forEach(num => {
    ['roja','amarilla','verde'].forEach(c => 
      document.getElementById(c + num)?.classList.remove('activa')
    );
  });
});

// ======================
// RENDER TABLA
// ======================
function renderTable() {
  const head = document.getElementById('tableHead');
  const body = document.getElementById('tableBody');
  body.innerHTML = '';

  const columns = [
    'folio', 'OT', 'datetime', 'company', 'engineer', 'phone', 'city', 'description',
    'brand', 'model', 'serial', 'controlnum', 'status_test', 'ubication', 'temperature', 'humidity',
    'info_fail', 'status', 'if_not_work', 'part_change', 'act_work', 'ini_work', 'fin_work', 'heat_from',
    'heat_target', 'heat_test', 'hum_low', 'hum_high', 'hum_test', 'temp_high', 'temp_low', 'cold_test',
    'get_time_target', 'pulldown','notes', 'name_esp', 'name_cus', 'signatureEsp', 'signatureCus'
  ];

  head.innerHTML = columns.map(c => `<th>${c.toUpperCase().replace(/_/g, ' ')}</th>`).join('');

  records.forEach(r => {
    const row = `<tr>${columns.map(c => {
      let data = r[c] || '';
      if (Array.isArray(data)) {
        data = data.filter(v => v != null && v !== '').join('<br>');
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
  if (!records.length) return alert('No hay registros para exportar.');
  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
  XLSX.writeFile(wb, 'Registro_de_arranques.xlsx');
});

// ======================
// BORRAR REGISTROS
// ======================
const deleteBtn = document.getElementById('deleteAllBtn');
deleteBtn.style.display = enableDeleteButton ? 'inline-block' : 'none';
deleteBtn.onclick = () => {
  if (!enableDeleteButton) return;
  if (confirm('¿Borrar todos los registros guardados?')) {
    localStorage.removeItem(storageKey);
    records = [];
    renderTable();
  }
};

// ======================
// FIRMA (MODAL)
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function openSignature(target) {
  currentSignatureTarget = target;
  modal.classList.add('active');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('openSignatureEsp').addEventListener('click', () => openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click', () => openSignature('cus'));

document.getElementById('closeSignature').addEventListener('click', () => modal.classList.remove('active'));
document.getElementById('clearSignature').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

document.getElementById('saveSignature').addEventListener('click', () => {
  const dataURL = canvas.toDataURL();
  const preview = currentSignatureTarget === 'esp'
    ? document.getElementById('signaturePreviewEsp')
    : document.getElementById('signaturePreviewCus');

  if (!preview) {
    console.error('No se encontró el canvas de vista previa para la firma.');
    modal.classList.remove('active');
    return;
  }

  const pctx = preview.getContext('2d');
  const img = new Image();
  img.onload = () => {
    pctx.clearRect(0, 0, 300, 150);
    pctx.drawImage(img, 0, 0, 300, 150);
  };
  img.src = dataURL;
  modal.classList.remove('active');
});

// ======================
// DIBUJO CANVAS
// ======================
function getTouchPos(canvasDom, touchEvent) {
  const rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

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

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  drawing = true;
  const touch = getTouchPos(canvas, e);
  ctx.beginPath();
  ctx.moveTo(touch.x, touch.y);
});
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
});

// ======================
// SEMÁFOROS
// ======================
function setEstado(num, color) {
  const colores = ['roja', 'amarilla', 'verde'];
  colores.forEach(c => document.getElementById(c + num).classList.remove('activa'));
  document.getElementById(color + num).classList.add('activa');
  estados[num] = color; // 👈 guardar el color en variable global
}

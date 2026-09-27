/**
 * SISTEM MONITORING & REKAPITULASI KEUANGAN BENGKEL TERPADU
 * Konsolidasi: Shop & Drive & Bima Motor
 * Full Dynamic Calculation Engine with Full CRUD (Tambah, Edit, Hapus)
 */

// ================= DATA INITIAL STATE / SAMPLE DATA =================
const DEFAULT_TRANSACTIONS = [
    // --- Penjualan Aki & Baterai (S&D: 24.500.000, BM: 8.200.000 -> Total: 32.700.000) ---
    { id: 'tx-1', date: '2026-09-02', unit: 'SD', category: 'aki', desc: 'Penjualan GS Astra Hybrid NS40Z (10 unit)', amount: 10500000, cogs: 6600000 },
    { id: 'tx-2', date: '2026-09-08', unit: 'SD', category: 'aki', desc: 'Penjualan GS Astra Maintenance Free 55D23L (8 unit)', amount: 9600000, cogs: 6000000 },
    { id: 'tx-3', date: '2026-09-18', unit: 'SD', category: 'aki', desc: 'Penjualan Incoe Gold NS60 (4 unit)', amount: 4400000, cogs: 2800000 },
    { id: 'tx-4', date: '2026-09-05', unit: 'BM', category: 'aki', desc: 'Penjualan Aki Motor & Mobil Kompak GS Astra', amount: 4200000, cogs: 2700000 },
    { id: 'tx-5', date: '2026-09-22', unit: 'BM', category: 'aki', desc: 'Penjualan Incoe MF & Aki Bebas Perawatan', amount: 4000000, cogs: 2500000 },

    // --- Penjualan Oli & Pelumas (S&D: 13.200.000, BM: 11.400.000 -> Total: 24.600.000) ---
    { id: 'tx-6', date: '2026-09-03', unit: 'SD', category: 'oli', desc: 'Penjualan Shell Helix Astra 10W-40 (20 Galon)', amount: 8400000, cogs: 5250000 },
    { id: 'tx-7', date: '2026-09-15', unit: 'SD', category: 'oli', desc: 'Penjualan Shell Helix HX6 & Fastron Gold', amount: 4800000, cogs: 3000000 },
    { id: 'tx-8', date: '2026-09-06', unit: 'BM', category: 'oli', desc: 'Penjualan Fastron Techno 10W-40 & Motul 3100', amount: 6200000, cogs: 3750000 },
    { id: 'tx-9', date: '2026-09-20', unit: 'BM', category: 'oli', desc: 'Penjualan Pelumas Pertamina Mesran & Castrol', amount: 5200000, cogs: 3150000 },

    // --- Penjualan Ban & Aksesori Tambahan (S&D: 6.500.000, BM: 2.800.000 -> Total: 9.300.000) ---
    { id: 'tx-10', date: '2026-09-10', unit: 'SD', category: 'ban', desc: 'Penjualan Bridgestone Ecopia 185/65 R15 (8 pcs) + Aksesori', amount: 6500000, cogs: 4200000 },
    { id: 'tx-11', date: '2026-09-14', unit: 'BM', category: 'ban', desc: 'Penjualan Ban Luar Motor Tubeless IRC/Aspira & Ban Dalam', amount: 2800000, cogs: 1700000 },

    // --- Penjualan Sparepart / Suku Cadang Mesin (S&D: 1.800.000, BM: 8.600.000 -> Total: 10.400.000) ---
    { id: 'tx-12', date: '2026-09-12', unit: 'SD', category: 'part', desc: 'Filter Udara, Filter Oli & Busi Denso Iridium', amount: 1800000, cogs: 1100000 },
    { id: 'tx-13', date: '2026-09-09', unit: 'BM', category: 'part', desc: 'Brake Pad Avanza, Kampas Rem & V-Belt Astra', amount: 4500000, cogs: 2700000 },
    { id: 'tx-14', date: '2026-09-24', unit: 'BM', category: 'part', desc: 'Roller CVT, Shock Absorber & Suku Cadang Mesin', amount: 4100000, cogs: 2500000 },

    // --- Jasa Servis Ringan, Pasang & Tune-Up (S&D: 1.850.000, BM: 3.650.000 -> Total: 5.500.000, HPP Rp0) ---
    { id: 'tx-15', date: '2026-09-16', unit: 'SD', category: 'jasa', desc: 'Jasa Ganti Oli, Spooring Ringan & Pasang Aki', amount: 1850000, cogs: 0 },
    { id: 'tx-16', date: '2026-09-25', unit: 'BM', category: 'jasa', desc: 'Jasa Tune-Up Mesin, Bongkar CVT & Servis Rem', amount: 3650000, cogs: 0 }
];

const DEFAULT_OPEX = [
    { code: 'OPX-01', name: '1. Pembayaran Gaji Karyawan, Mekanik & Insentif Kerja', sd: 4500000, bm: 5000000 },
    { code: 'OPX-02', name: '2. Alokasi Sewa Gedung / Ruko & Lahan Bengkel', sd: 1500000, bm: 1500000 },
    { code: 'OPX-03', name: '3. Utilitas (Listrik PLN Bengkel, Pompa Air & Wifi POS)', sd: 850000, bm: 750000 },
    { code: 'OPX-04', name: '4. Perlengkapan Kerja (Majun, WD-40, Sabun, Perawatan Tools)', sd: 450000, bm: 400000 },
    { code: 'OPX-05', name: '5. Pemasaran, Cetak Spanduk, Brosur & Merchant Fee EDC/QRIS', sd: 350000, bm: 250000 },
    { code: 'OPX-06', name: '6. Administrasi, ATK Kertas Struk, Kebersihan & Kas Kecil', sd: 250000, bm: 200000 }
];

const DEFAULT_FAKTUR = [
    { id: 'fak-1', date: '2026-09-05', unit: 'Shop & Drive', no: 'INV-AST-0901', desc: 'Aki GS Astra Hybrid NS40Z & NS60 (15 Pcs)', method: 'Transfer BCA', amount: 12500000, status: 'Lunas' },
    { id: 'fak-2', date: '2026-09-10', unit: 'Bima Motor', no: 'INV-AST-0914', desc: 'Filter Oli, Shock Absorber & Part Aspira', method: 'Trf Mandiri', amount: 6800000, status: 'Lunas' },
    { id: 'fak-3', date: '2026-09-15', unit: 'Shop & Drive', no: 'INV-AST-0925', desc: 'Pelumas Shell Helix Astra 10W-40 (5 Dus)', method: 'Giro Bilyet', amount: 8250000, status: 'Lunas' },
    { id: 'fak-4', date: '2026-09-20', unit: 'Shop & Drive', no: 'INV-AST-0940', desc: 'Aki GS Maintenance Free (MF) 55D23L & NS70', method: 'Transfer BCA', amount: 10000000, status: 'Sebagian*' },
    { id: 'fak-5', date: '2026-09-25', unit: 'Bima Motor', no: 'INV-AST-0955', desc: 'Van Belt, Roller & Kampas Ganda Astra', method: 'Transfer BCA', amount: 4300000, status: 'Lunas' }
];

const DEFAULT_STOCKS = [
    { code: 'AKI-01', name: 'Aki GS Astra Hybrid NS60L (Segel Astra) - S&D Rak Depan', qtyText: '9 Pcs', valueRp: 7650000, kondisi: 'Aman' },
    { code: 'AKI-02', name: 'Aki Incoe Gold MF 55D23L (Innova/Camry) - Bima Motor Rak 1', qtyText: '2 Pcs', valueRp: 1900000, kondisi: 'Reorder' },
    { code: 'OLI-01', name: 'Shell Helix Astra 10W-40 Galon (4 Liter) - Gudang S&D Lt. 1', qtyText: '12 Gln', valueRp: 4320000, kondisi: 'Aman' },
    { code: 'OLI-02', name: 'Fastron Techno 10W-40 Botol (1 Liter) - Bima Motor Etalase', qtyText: '17 Btl', valueRp: 1615000, kondisi: 'Aman' },
    { code: 'SPR-01', name: 'Brake Pad Depan Avanza/Veloz/Xenia (Set) - Bima Motor Laci B', qtyText: '3 Set', valueRp: 900000, kondisi: 'Reorder' },
    { code: 'BAN-01', name: 'Bridgestone Ecopia 185/65 R15 (Tahun 2026) - S&D Susun Ban', qtyText: '4 Pcs', valueRp: 3200000, kondisi: 'Cukup' }
];

const DEFAULT_NOTES = [
    "1. Pengadaan Mendesak: Segera ajukan PO ulang ke Suplier Astra untuk Aki Incoe MF 55D23L (sisa 2 unit) dan Kampas Rem Avanza (sisa 3 set) sebelum minggu pertama Oktober 2026.",
    "2. Hutang Dagang Astra: Sisa pelunasan faktur INV-AST-0940 sebesar Rp 5.500.000 dialokasikan melalui kas masuk Shop & Drive tanggal 05 Oktober 2026.",
    "3. Kondisi Fisik: Hasil stock opname tanggal 27 September menunjukkan tidak ada barang cacat atau bocor; seluruh selisih fisik telah disesuaikan dengan faktur keluar."
];

// ================= APP STATE =================
let transactions = [];
let opexList = [];
let fakturList = [];
let stockList = [];
let gudangNotes = [];
let activePeriodMode = 'this_month'; // 'today', 'week', 'this_month', 'all', 'custom'
let filterStartDate = '2026-09-01';
let filterEndDate = '2026-09-30';
let reportSignDate = '2026-09-27';

let chartTrendInstance = null;
let chartCategoryInstance = null;

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    if (activePeriodMode === 'custom') {
        document.getElementById('filter-date-start').value = filterStartDate;
        document.getElementById('filter-date-end').value = filterEndDate;
        document.querySelectorAll('.period-pill').forEach(btn => btn.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-sm'));
    } else {
        setPeriodFilter(activePeriodMode);
    }
    const reportDateInput = document.getElementById('input-report-date');
    if (reportDateInput) reportDateInput.value = reportSignDate;
    lucide.createIcons();
    initCharts();
    renderDashboard();
});

function loadStoredData() {
    const sTx = localStorage.getItem('bengkel_transactions');
    const sOpex = localStorage.getItem('bengkel_opex');
    const sFaktur = localStorage.getItem('bengkel_faktur');
    const sStock = localStorage.getItem('bengkel_stock');
    const sNotes = localStorage.getItem('bengkel_notes');
    const sSignDate = localStorage.getItem('bengkel_report_date');
    const sDateStart = localStorage.getItem('bengkel_date_start');
    const sDateEnd = localStorage.getItem('bengkel_date_end');
    const sMode = localStorage.getItem('bengkel_period_mode');

    transactions = sTx ? JSON.parse(sTx) : JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
    opexList = sOpex ? JSON.parse(sOpex) : JSON.parse(JSON.stringify(DEFAULT_OPEX));
    
    // Pastikan jika data OPEX sebelumnya kosong atau BM bernilai 0 seluruhnya, muat default lengkap
    if (opexList.length === 0 || opexList.every(op => Number(op.bm || 0) === 0)) {
        opexList = JSON.parse(JSON.stringify(DEFAULT_OPEX));
    }
    
    fakturList = sFaktur ? JSON.parse(sFaktur) : JSON.parse(JSON.stringify(DEFAULT_FAKTUR));
    stockList = sStock ? JSON.parse(sStock) : JSON.parse(JSON.stringify(DEFAULT_STOCKS));
    gudangNotes = sNotes ? JSON.parse(sNotes) : [...DEFAULT_NOTES];
    if (sSignDate) reportSignDate = sSignDate;
    if (sDateStart) filterStartDate = sDateStart;
    if (sDateEnd) filterEndDate = sDateEnd;
    if (sMode) activePeriodMode = sMode;

    saveToLocalStorage();
}

function saveToLocalStorage() {
    const dbPayload = {
        transactions,
        opexList,
        fakturList,
        stockList,
        gudangNotes,
        reportSignDate,
        filterStartDate,
        filterEndDate,
        activePeriodMode,
        lastSaved: new Date().toISOString()
    };

    localStorage.setItem('bengkel_transactions', JSON.stringify(transactions));
    localStorage.setItem('bengkel_opex', JSON.stringify(opexList));
    localStorage.setItem('bengkel_faktur', JSON.stringify(fakturList));
    localStorage.setItem('bengkel_stock', JSON.stringify(stockList));
    localStorage.setItem('bengkel_notes', JSON.stringify(gudangNotes));
    localStorage.setItem('bengkel_report_date', reportSignDate);
    localStorage.setItem('bengkel_date_start', filterStartDate);
    localStorage.setItem('bengkel_date_end', filterEndDate);
    localStorage.setItem('bengkel_period_mode', activePeriodMode);

    // Sync to backend database server if online
    syncToBackendDatabase(dbPayload);
}

// ================= DATABASE SYNC ENGINE =================
function syncToBackendDatabase(payload) {
    if (window.location.protocol.startsWith('http')) {
        fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            const detailEl = document.getElementById('db-status-detail');
            if (detailEl) detailEl.textContent = `Tersimpan ke Server Database: ${new Date().toLocaleTimeString('id-ID')}`;
        })
        .catch(err => {
            // Offline/direct file mode, stored in browser DB
        });
    }
}

function saveToDatabaseManually() {
    saveToLocalStorage();
    showToast('💾 Seluruh data berhasil disimpan permanen ke Database!');
    closeModal('modal-database-mgr');
}

function exportDatabaseFile() {
    const dbPayload = {
        app: 'MONITOR_KEUANGAN_BENGKEL_TERPADU',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        transactions,
        opexList,
        fakturList,
        stockList,
        gudangNotes,
        reportSignDate,
        filterStartDate,
        filterEndDate
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbPayload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `Database_Bengkel_Terpadu_${formatDateISO(new Date())}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    showToast('✅ File cadangan database berhasil diunduh!');
}

function importDatabaseFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.transactions) transactions = data.transactions;
            if (data.opexList) opexList = data.opexList;
            if (data.fakturList) fakturList = data.fakturList;
            if (data.stockList) stockList = data.stockList;
            if (data.gudangNotes) gudangNotes = data.gudangNotes;
            if (data.reportSignDate) reportSignDate = data.reportSignDate;
            if (data.filterStartDate) filterStartDate = data.filterStartDate;
            if (data.filterEndDate) filterEndDate = data.filterEndDate;

            saveToLocalStorage();
            renderDashboard();
            closeModal('modal-database-mgr');
            alert('🎉 Database berhasil dipulihkan dan disinkronkan!');
        } catch (err) {
            alert('Gagal membaca file database JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}

function showToast(message) {
    const toast = document.getElementById('toast-notify');
    const msgEl = document.getElementById('toast-message');
    if (toast && msgEl) {
        msgEl.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }
}

function resetToSampleData() {
    if (confirm('Apakah Anda yakin ingin me-reset seluruh data kembali ke Data Sample Laporan September 2026?')) {
        transactions = JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
        opexList = JSON.parse(JSON.stringify(DEFAULT_OPEX));
        fakturList = JSON.parse(JSON.stringify(DEFAULT_FAKTUR));
        stockList = JSON.parse(JSON.stringify(DEFAULT_STOCKS));
        gudangNotes = [...DEFAULT_NOTES];
        saveToLocalStorage();
        setPeriodFilter('this_month');
        closeModal('modal-reset-data');
        showToast('Data berhasil di-reset ke data sample!');
    }
}

function resetToEmptyData() {
    if (confirm('PERINGATAN: Seluruh riwayat transaksi penjualan dan faktur akan dikosongkan untuk memulai buku baru dari nol. Lanjutkan?')) {
        transactions = [];
        fakturList = [];
        // Keep OPEX master categories with 0 values
        opexList = DEFAULT_OPEX.map(o => ({ ...o, sd: 0, bm: 0 }));
        saveToLocalStorage();
        renderDashboard();
        closeModal('modal-reset-data');
        showToast('Buku transaksi dikosongkan.');
    }
}

// ================= PERIOD FILTERING ENGINE =================
function setPeriodFilter(mode) {
    activePeriodMode = mode;
    document.querySelectorAll('.period-pill').forEach(btn => btn.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-sm'));
    const activeBtn = document.getElementById(`btn-period-${mode}`);
    if (activeBtn) activeBtn.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-sm');

    const todayStr = '2026-09-27'; // Reference current context date
    const today = new Date(todayStr);

    if (mode === 'today') {
        filterStartDate = todayStr;
        filterEndDate = todayStr;
    } else if (mode === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 6);
        filterStartDate = formatDateISO(lastWeek);
        filterEndDate = todayStr;
    } else if (mode === 'this_month') {
        filterStartDate = '2026-09-01';
        filterEndDate = '2026-09-30';
    } else if (mode === 'all') {
        filterStartDate = '2020-01-01';
        filterEndDate = '2030-12-31';
    }

    document.getElementById('filter-date-start').value = filterStartDate;
    document.getElementById('filter-date-end').value = filterEndDate;
    renderDashboard();
}

function applyCustomDateFilter() {
    saveAndApplyDateFilter();
}

function saveAndApplyDateFilter() {
    const s = document.getElementById('filter-date-start').value;
    const e = document.getElementById('filter-date-end').value;
    if (!s || !e) {
        alert('Silakan pilih rentang tanggal awal dan akhir!');
        return;
    }
    if (s > e) {
        alert('Tanggal awal tidak boleh lebih besar dari tanggal akhir!');
        return;
    }
    filterStartDate = s;
    filterEndDate = e;
    activePeriodMode = 'custom';
    saveToLocalStorage();
    document.querySelectorAll('.period-pill').forEach(btn => btn.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-sm'));
    renderDashboard();
    alert(`Rentang Tanggal Berhasil Disimpan: ${formatIndoDate(filterStartDate)} s/d ${formatIndoDate(filterEndDate)}`);
}

function saveReportDate() {
    const d = document.getElementById('input-report-date').value;
    if (!d) {
        alert('Silakan pilih tanggal pengesahan!');
        return;
    }
    reportSignDate = d;
    saveToLocalStorage();
    renderDashboard();
    alert(`Tanggal Pengesahan Laporan Berhasil Disimpan: ${formatIndoDate(reportSignDate)}`);
}

function formatDateISO(d) {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function formatRupiah(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

function formatRupiahPlain(num) {
    return Number(num || 0).toLocaleString('id-ID');
}

function formatIndoDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

// ================= CALCULATION & RENDERING =================
function renderDashboard() {
    const unitFilter = document.getElementById('filter-unit').value; // ALL, SD, BM

    // 1. Filter Transactions by Date & Unit
    const filteredTx = transactions.filter(tx => {
        const inDate = tx.date >= filterStartDate && tx.date <= filterEndDate;
        const inUnit = (unitFilter === 'ALL') || (tx.unit === unitFilter);
        return inDate && inUnit;
    });

    // Update active period label
    const periodLabel = `Periode Aktif: ${formatIndoDate(filterStartDate)} s/d ${formatIndoDate(filterEndDate)}`;
    document.getElementById('badge-active-period').textContent = periodLabel;
    document.getElementById('count-transactions').textContent = filteredTx.length;

    // 2. Aggregate Sales and COGS by Category & Unit
    const agg = {
        aki: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        oli: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        ban: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        part: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        jasa: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 }
    };

    filteredTx.forEach(t => {
        if (agg[t.category]) {
            if (t.unit === 'SD') {
                agg[t.category].sd += Number(t.amount);
                agg[t.category].cogs_sd += Number(t.cogs || 0);
            } else if (t.unit === 'BM') {
                agg[t.category].bm += Number(t.amount);
                agg[t.category].cogs_bm += Number(t.cogs || 0);
            }
        }
    });

    // Subtotals Penjualan
    const sales_sd = agg.aki.sd + agg.oli.sd + agg.ban.sd + agg.part.sd + agg.jasa.sd;
    const sales_bm = agg.aki.bm + agg.oli.bm + agg.ban.bm + agg.part.bm + agg.jasa.bm;
    const total_sales = sales_sd + sales_bm;

    // 2.b HPP / MODAL BARANG DIAMBIL LANGSUNG DARI JUMLAH PEMBAYARAN FAKTUR SUPLIER ASTRA
    const filteredFaktur = fakturList.filter(f => f.date >= filterStartDate && f.date <= filterEndDate);
    let cogs_sd = 0;
    let cogs_bm = 0;

    filteredFaktur.forEach(f => {
        const u = (f.unit || '').toLowerCase();
        if (u.includes('shop') || u === 'sd') {
            cogs_sd += Number(f.amount || 0);
        } else if (u.includes('bima') || u === 'bm') {
            cogs_bm += Number(f.amount || 0);
        }
    });

    // Jika filter unit aktif
    if (unitFilter === 'SD') cogs_bm = 0;
    if (unitFilter === 'BM') cogs_sd = 0;

    const total_cogs = cogs_sd + cogs_bm;

    // Laba Kotor Penjualan = Penjualan - HPP (Faktur Astra)
    const gross_profit_sd = sales_sd - cogs_sd;
    const gross_profit_bm = sales_bm - cogs_bm;
    const total_gross_profit = total_sales - total_cogs;

    // 2.c BIAYA OPERASIONAL & GAJI (OPEX)
    let opex_sd = 0;
    let opex_bm = 0;
    opexList.forEach(op => {
        opex_sd += Number(op.sd || 0);
        opex_bm += Number(op.bm || 0);
    });

    if (unitFilter === 'SD') opex_bm = 0;
    if (unitFilter === 'BM') opex_sd = 0;

    const total_opex = opex_sd + opex_bm;

    // Total Laba Bersih Akhir = Penjualan - HPP Astra - Opex
    const net_profit_sd = gross_profit_sd - opex_sd;
    const net_profit_bm = gross_profit_bm - opex_bm;
    const total_net_profit = total_gross_profit - total_opex;

    // Ratios
    const sdRatio = total_sales > 0 ? Math.round((sales_sd / total_sales) * 100) : 0;
    const bmRatio = total_sales > 0 ? (100 - sdRatio) : 0;
    const cogsPct = total_sales > 0 ? ((total_cogs / total_sales) * 100).toFixed(1) : '0.0';
    const netMargin = total_sales > 0 ? ((total_net_profit / total_sales) * 100).toFixed(1) : '0.0';

    // 5. Update KPI Cards
    document.getElementById('kpi-total-sales').textContent = formatRupiah(total_sales);
    document.getElementById('kpi-sales-ratio').textContent = `S&D: ${sdRatio}% | BM: ${bmRatio}%`;
    document.getElementById('bar-ratio-sd').style.width = `${sdRatio}%`;
    document.getElementById('bar-ratio-bm').style.width = `${bmRatio}%`;

    document.getElementById('kpi-total-cogs').textContent = formatRupiah(total_cogs);
    document.getElementById('kpi-cogs-pct').textContent = `${cogsPct}% dari Penjualan`;

    const elKpiOpex = document.getElementById('kpi-total-opex');
    if (elKpiOpex) elKpiOpex.textContent = formatRupiah(total_opex);
    const elKpiOpexSd = document.getElementById('kpi-opex-sd');
    if (elKpiOpexSd) elKpiOpexSd.textContent = formatRupiah(opex_sd);
    const elKpiOpexBm = document.getElementById('kpi-opex-bm');
    if (elKpiOpexBm) elKpiOpexBm.textContent = formatRupiah(opex_bm);

    document.getElementById('kpi-net-profit').textContent = formatRupiah(total_net_profit);
    document.getElementById('kpi-net-margin').textContent = `${netMargin}%`;

    // 6. Update Table 1: Laba Rugi Komparatif
    const cats = ['aki', 'oli', 'ban', 'part', 'jasa'];
    cats.forEach(cat => {
        document.getElementById(`row-${cat}-sd`).textContent = formatRupiahPlain(agg[cat].sd);
        document.getElementById(`row-${cat}-bm`).textContent = formatRupiahPlain(agg[cat].bm);
        document.getElementById(`row-${cat}-total`).textContent = formatRupiahPlain(agg[cat].sd + agg[cat].bm);
    });

    document.getElementById('row-sales-sd').textContent = formatRupiahPlain(sales_sd);
    document.getElementById('row-sales-bm').textContent = formatRupiahPlain(sales_bm);
    document.getElementById('row-sales-total').textContent = formatRupiahPlain(total_sales);

    document.getElementById('row-cogs-sd').textContent = formatRupiahPlain(cogs_sd);
    document.getElementById('row-cogs-bm').textContent = formatRupiahPlain(cogs_bm);
    document.getElementById('row-cogs-total').textContent = formatRupiahPlain(total_cogs);

    // Laba Kotor (1 - B)
    const elGpSd = document.getElementById('row-gross-profit-sd');
    const elGpBm = document.getElementById('row-gross-profit-bm');
    const elGpTot = document.getElementById('row-gross-profit-total');
    if (elGpSd) elGpSd.textContent = formatRupiahPlain(gross_profit_sd);
    if (elGpBm) elGpBm.textContent = formatRupiahPlain(gross_profit_bm);
    if (elGpTot) elGpTot.textContent = formatRupiahPlain(total_gross_profit);

    // Section C. Biaya Operasional & Gaji
    const tbodyOpexT1 = document.getElementById('tbody-opex-table1');
    if (tbodyOpexT1) {
        tbodyOpexT1.innerHTML = opexList.map(op => {
            const sd = Number(op.sd || 0);
            const bm = Number(op.bm || 0);
            return `
                <tr class="hover:bg-slate-50">
                    <td class="py-2.5 px-4 pl-7 text-slate-700">${op.name}</td>
                    <td class="py-2.5 px-4 text-right font-semibold text-slate-800">${formatRupiahPlain(sd)}</td>
                    <td class="py-2.5 px-4 text-right font-semibold text-slate-800">${formatRupiahPlain(bm)}</td>
                    <td class="py-2.5 px-4 text-right font-bold text-rose-900 bg-rose-50/30">${formatRupiahPlain(sd + bm)}</td>
                </tr>
            `;
        }).join('');
    }

    const elOpexSd = document.getElementById('row-opex-sd');
    const elOpexBm = document.getElementById('row-opex-bm');
    const elOpexTot = document.getElementById('row-opex-total');
    if (elOpexSd) elOpexSd.textContent = formatRupiahPlain(opex_sd);
    if (elOpexBm) elOpexBm.textContent = formatRupiahPlain(opex_bm);
    if (elOpexTot) elOpexTot.textContent = formatRupiahPlain(total_opex);

    // Total Laba Bersih Akhir (1 - B - C)
    const elNetSd = document.getElementById('row-net-sd');
    const elNetBm = document.getElementById('row-net-bm');
    const elNetTot = document.getElementById('row-net-total');
    if (elNetSd) elNetSd.textContent = formatRupiah(net_profit_sd);
    if (elNetBm) elNetBm.textContent = formatRupiah(net_profit_bm);
    if (elNetTot) elNetTot.textContent = formatRupiah(total_net_profit);

    // 7. Render Table 2: Biaya Operasional & Gaji (with Edit & Delete buttons)
    renderOpexTable();

    // 8. Render Table 3: Faktur Suplier Astra (with Edit & Delete buttons)
    renderFakturTable();

    // 9. Render Table 4: Stock Gudang (with Edit & Delete buttons)
    renderStockTable();

    // 10. Render Raw Transactions Table (with Edit & Delete buttons)
    renderRawTransactionsTable(filteredTx);

    // 11. Update Charts
    updateCharts(agg, filteredTx);

    lucide.createIcons();
}

// ================= BIAYA OPERASIONAL & GAJI (OPEX) CRUD =================
function renderOpexTable() {
    const tbody = document.getElementById('tbody-opex-tab');
    if (!tbody) return;
    tbody.innerHTML = '';
    let totalSD = 0, totalBM = 0;

    opexList.forEach((op, idx) => {
        const code = op.code || ('OPX-' + String(idx + 1).padStart(2, '0'));
        const sd = Number(op.sd || 0);
        const bm = Number(op.bm || 0);
        const tot = sd + bm;
        totalSD += sd;
        totalBM += bm;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition';
        tr.innerHTML = `
            <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-700">${code}</td>
            <td class="py-2.5 px-4 text-slate-800 font-semibold">${op.name}</td>
            <td class="py-2.5 px-4 text-right font-bold text-red-700">${formatRupiahPlain(sd)}</td>
            <td class="py-2.5 px-4 text-right font-bold text-blue-700">${formatRupiahPlain(bm)}</td>
            <td class="py-2.5 px-4 text-right font-extrabold text-rose-900 bg-rose-50/40">${formatRupiahPlain(tot)}</td>
            <td class="py-2.5 px-2 text-center">
                <div class="flex items-center justify-center space-x-1">
                    <button onclick="openModalEditOpex('${code}')" class="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded" title="Edit Biaya / Gaji">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="deleteOpex('${code}')" class="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded" title="Hapus Biaya / Gaji">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const tfootSD = document.getElementById('tfoot-opex-sd');
    const tfootBM = document.getElementById('tfoot-opex-bm');
    const tfootTotal = document.getElementById('tfoot-opex-total');
    if (tfootSD) tfootSD.textContent = formatRupiahPlain(totalSD);
    if (tfootBM) tfootBM.textContent = formatRupiahPlain(totalBM);
    if (tfootTotal) tfootTotal.textContent = formatRupiahPlain(totalSD + totalBM);
}

function openModalAddOpex() {
    document.getElementById('modal-opex-title').innerHTML = '<i data-lucide="wallet-cards" class="w-4 h-4 mr-2 text-rose-300"></i> Input Biaya Operasional & Gaji Baru';
    document.getElementById('opex-edit-code').value = '';
    document.getElementById('opex-name').value = '';
    document.getElementById('opex-sd').value = '';
    document.getElementById('opex-bm').value = '';

    openModal('modal-opex-form');
}

function openModalEditOpex(code) {
    const op = opexList.find((o, idx) => o.code === code || ('OPX-' + String(idx + 1).padStart(2, '0')) === code);
    if (!op) return;

    const itemCode = op.code || code;
    document.getElementById('modal-opex-title').innerHTML = `<i data-lucide="edit-3" class="w-4 h-4 mr-2 text-rose-300"></i> Edit Biaya / Gaji [${itemCode}]`;
    document.getElementById('opex-edit-code').value = itemCode;
    document.getElementById('opex-name').value = op.name;
    document.getElementById('opex-sd').value = op.sd || 0;
    document.getElementById('opex-bm').value = op.bm || 0;

    openModal('modal-opex-form');
}

function handleSaveOpex(e) {
    e.preventDefault();
    const editCode = document.getElementById('opex-edit-code').value;
    const name = document.getElementById('opex-name').value.trim();
    const sd = Number(document.getElementById('opex-sd').value || 0);
    const bm = Number(document.getElementById('opex-bm').value || 0);

    if (editCode) {
        const idx = opexList.findIndex((o, i) => o.code === editCode || ('OPX-' + String(i + 1).padStart(2, '0')) === editCode);
        if (idx !== -1) {
            opexList[idx] = { ...opexList[idx], name, sd, bm };
        }
    } else {
        const nextCode = 'OPX-' + String(opexList.length + 1).padStart(2, '0');
        opexList.push({ code: nextCode, name, sd, bm });
    }

    saveToLocalStorage();
    closeModal('modal-opex-form');
    e.target.reset();
    renderDashboard();
    showToast('✅ Biaya Operasional & Gaji berhasil disimpan!');
}

function deleteOpex(code) {
    const op = opexList.find((o, idx) => o.code === code || ('OPX-' + String(idx + 1).padStart(2, '0')) === code);
    if (!op) return;

    if (confirm(`Apakah Anda yakin ingin menghapus pos [${op.code || code}] ${op.name}?`)) {
        opexList = opexList.filter((o, idx) => o.code !== code && ('OPX-' + String(idx + 1).padStart(2, '0')) !== code);
        saveToLocalStorage();
        renderDashboard();
    }
}

// ================= TRANSACTIONS CRUD =================
function renderRawTransactionsTable(txList) {
    const tbody = document.getElementById('tbody-raw-sales');
    tbody.innerHTML = '';

    const catLabels = {
        aki: 'Aki & Baterai',
        oli: 'Oli & Pelumas',
        ban: 'Ban & Aksesori',
        part: 'Sparepart Mesin',
        jasa: 'Jasa Servis'
    };

    txList.forEach(t => {
        const margin = Number(t.amount) - Number(t.cogs || 0);
        const unitBadge = t.unit === 'SD' ? '<span class="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold">Shop & Drive</span>' :
                                           '<span class="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">Bima Motor</span>';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition';
        tr.innerHTML = `
            <td class="py-2 px-3 text-slate-600">${formatIndoDate(t.date)}</td>
            <td class="py-2 px-3">${unitBadge}</td>
            <td class="py-2 px-3 font-semibold text-slate-700">${catLabels[t.category] || t.category}</td>
            <td class="py-2 px-4 text-slate-800">${t.desc}</td>
            <td class="py-2 px-3 text-right font-bold text-slate-900">${formatRupiahPlain(t.amount)}</td>
            <td class="py-2 px-3 text-right text-slate-600">${formatRupiahPlain(t.cogs)}</td>
            <td class="py-2 px-3 text-right font-semibold text-emerald-700">${formatRupiahPlain(margin)}</td>
            <td class="py-2 px-2 text-center">
                <div class="flex items-center justify-center space-x-1">
                    <button onclick="openModalEditTransaction('${t.id}')" class="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded" title="Edit Transaksi">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="deleteTransaction('${t.id}')" class="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded" title="Hapus Transaksi">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModalAddTransaction() {
    document.getElementById('modal-tx-title').innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4 mr-2"></i> Input Transaksi Penjualan Harian';
    document.getElementById('tx-edit-id').value = '';
    document.getElementById('tx-date').value = formatDateISO(new Date('2026-09-27'));
    document.getElementById('tx-unit').value = 'SD';
    document.getElementById('tx-category').value = 'aki';
    document.getElementById('tx-desc').value = '';
    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-cogs').value = '';

    openModal('modal-transaction-form');
}

function openModalEditTransaction(id) {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    document.getElementById('modal-tx-title').innerHTML = '<i data-lucide="edit-3" class="w-4 h-4 mr-2"></i> Edit Transaksi Penjualan';
    document.getElementById('tx-edit-id').value = tx.id;
    document.getElementById('tx-date').value = tx.date;
    document.getElementById('tx-unit').value = tx.unit;
    document.getElementById('tx-category').value = tx.category;
    document.getElementById('tx-desc').value = tx.desc;
    document.getElementById('tx-amount').value = tx.amount;
    document.getElementById('tx-cogs').value = tx.cogs || 0;

    openModal('modal-transaction-form');
}

function handleSaveTransaction(e) {
    e.preventDefault();
    const editId = document.getElementById('tx-edit-id').value;
    const txData = {
        date: document.getElementById('tx-date').value,
        unit: document.getElementById('tx-unit').value,
        category: document.getElementById('tx-category').value,
        desc: document.getElementById('tx-desc').value,
        amount: Number(document.getElementById('tx-amount').value),
        cogs: Number(document.getElementById('tx-cogs').value || 0)
    };

    if (editId) {
        const idx = transactions.findIndex(t => t.id === editId);
        if (idx !== -1) {
            transactions[idx] = { ...transactions[idx], ...txData };
        }
    } else {
        const newTx = { id: 'tx-' + Date.now(), ...txData };
        transactions.unshift(newTx);
    }

    saveToLocalStorage();
    closeModal('modal-transaction-form');
    e.target.reset();
    renderDashboard();
}

function deleteTransaction(id) {
    if (confirm('Hapus transaksi ini?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        renderDashboard();
    }
}

// ================= FAKTUR ASTRA CRUD =================
function renderFakturTable() {
    const tbody = document.getElementById('tbody-faktur');
    tbody.innerHTML = '';
    let totalBayar = 0;

    const filteredFaktur = fakturList.filter(f => {
        return f.date >= filterStartDate && f.date <= filterEndDate;
    });

    filteredFaktur.forEach(f => {
        totalBayar += Number(f.amount || 0);
        const statusClass = f.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' :
                           (f.status.includes('Sebagian') ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-rose-100 text-rose-800');

        const unitClass = f.unit === 'Shop & Drive' ? 'text-red-700 font-semibold' : 'text-blue-700 font-semibold';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition';
        tr.innerHTML = `
            <td class="py-2.5 px-3 text-center text-slate-600">${formatIndoDate(f.date)}</td>
            <td class="py-2.5 px-3 ${unitClass}">${f.unit}</td>
            <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${f.no}</td>
            <td class="py-2.5 px-4 text-slate-700">${f.desc}</td>
            <td class="py-2.5 px-3 text-slate-600">${f.method}</td>
            <td class="py-2.5 px-4 text-right font-bold text-slate-900">${formatRupiahPlain(f.amount)}</td>
            <td class="py-2.5 px-3 text-center">
                <span class="px-2 py-0.5 rounded-full text-[10px] ${statusClass}">${f.status}</span>
            </td>
            <td class="py-2.5 px-2 text-center">
                <div class="flex items-center justify-center space-x-1">
                    <button onclick="openModalEditFaktur('${f.id}')" class="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded" title="Edit Faktur">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="deleteFaktur('${f.id}')" class="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded" title="Hapus Faktur">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('tfoot-astra-total').textContent = formatRupiahPlain(totalBayar);
    document.getElementById('tfoot-astra-count').textContent = `${filteredFaktur.length} Transaksi`;
}

function openModalAddFaktur() {
    document.getElementById('modal-faktur-title').innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4 mr-2"></i> Input Faktur Suplier Astra';
    document.getElementById('faktur-edit-id').value = '';
    document.getElementById('faktur-date').value = formatDateISO(new Date('2026-09-27'));
    document.getElementById('faktur-unit').value = 'Shop & Drive';
    document.getElementById('faktur-no').value = '';
    document.getElementById('faktur-desc').value = '';
    document.getElementById('faktur-method').value = 'Transfer BCA';
    document.getElementById('faktur-status').value = 'Lunas';
    document.getElementById('faktur-amount').value = '';

    openModal('modal-faktur-form');
}

function openModalEditFaktur(id) {
    const f = fakturList.find(x => x.id === id);
    if (!f) return;

    document.getElementById('modal-faktur-title').innerHTML = `<i data-lucide="edit-3" class="w-4 h-4 mr-2"></i> Edit Faktur [${f.no}]`;
    document.getElementById('faktur-edit-id').value = f.id;
    document.getElementById('faktur-date').value = f.date;
    document.getElementById('faktur-unit').value = f.unit;
    document.getElementById('faktur-no').value = f.no;
    document.getElementById('faktur-desc').value = f.desc;
    document.getElementById('faktur-method').value = f.method;
    document.getElementById('faktur-status').value = f.status;
    document.getElementById('faktur-amount').value = f.amount;

    openModal('modal-faktur-form');
}

function handleSaveFaktur(e) {
    e.preventDefault();
    const editId = document.getElementById('faktur-edit-id').value;
    const fData = {
        date: document.getElementById('faktur-date').value,
        unit: document.getElementById('faktur-unit').value,
        no: document.getElementById('faktur-no').value,
        desc: document.getElementById('faktur-desc').value,
        method: document.getElementById('faktur-method').value,
        amount: Number(document.getElementById('faktur-amount').value),
        status: document.getElementById('faktur-status').value
    };

    if (editId) {
        const idx = fakturList.findIndex(x => x.id === editId);
        if (idx !== -1) {
            fakturList[idx] = { ...fakturList[idx], ...fData };
        }
    } else {
        const newFaktur = { id: 'fak-' + Date.now(), ...fData };
        fakturList.unshift(newFaktur);
    }

    saveToLocalStorage();
    closeModal('modal-faktur-form');
    e.target.reset();
    renderDashboard();
}

function deleteFaktur(id) {
    const f = fakturList.find(x => x.id === id);
    if (!f) return;

    if (confirm(`Apakah Anda yakin ingin menghapus faktur [${f.no}]?`)) {
        fakturList = fakturList.filter(x => x.id !== id);
        saveToLocalStorage();
        renderDashboard();
    }
}

// ================= STOK GUDANG CRUD (SIMPEL FREE TEXT & NILAI VALUE) =================
function renderStockTable() {
    const tbody = document.getElementById('tbody-stock');
    tbody.innerHTML = '';

    stockList.forEach((st, idx) => {
        const qtyDisplay = st.qtyText || ((st.awal !== undefined) ? `${Number(st.awal) + Number(st.masuk) - Number(st.keluar)} ${st.unit || 'Pcs'}` : '0 Pcs');
        const valDisplay = st.valueRp ? formatRupiahPlain(st.valueRp) : '-';
        const itemCode = st.code || 'STK-' + String(idx + 1).padStart(2, '0');

        const kondisiColor = st.kondisi === 'Aman' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                             (st.kondisi === 'Cukup' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-rose-700 bg-rose-50 border-rose-200 font-bold');

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition';
        tr.innerHTML = `
            <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-700">${itemCode}</td>
            <td class="py-2.5 px-4 text-slate-800 font-semibold">${st.name}</td>
            <td class="py-2.5 px-4 text-center font-extrabold text-indigo-900 bg-indigo-50/40">${qtyDisplay}</td>
            <td class="py-2.5 px-4 text-right font-bold text-emerald-800 bg-emerald-50/30">${valDisplay !== '-' ? 'Rp ' + valDisplay : '-'}</td>
            <td class="py-2.5 px-3 text-center">
                <span class="px-2.5 py-0.5 rounded text-[11px] border ${kondisiColor}">${st.kondisi || 'Aman'}</span>
            </td>
            <td class="py-2.5 px-2 text-center">
                <div class="flex items-center justify-center space-x-1">
                    <button onclick="openModalEditStock('${itemCode}')" class="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded" title="Edit Item Stok">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="deleteStock('${itemCode}')" class="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded" title="Hapus Item Stok">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Notes
    const containerNotes = document.getElementById('container-gudang-notes');
    if (containerNotes) {
        containerNotes.innerHTML = gudangNotes.map(n => `<p>${n}</p>`).join('');
    }
}

function openModalAddStock() {
    document.getElementById('modal-stock-title').innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4 mr-2 text-indigo-400"></i> Input Nilai Stok Baru (Free Text)';
    document.getElementById('stock-edit-original-code').value = '';
    document.getElementById('stock-name').value = '';
    document.getElementById('stock-qty-text').value = '';
    document.getElementById('stock-value-rp').value = '';
    document.getElementById('stock-kondisi').value = 'Aman';

    openModal('modal-stock-form');
}

function openModalEditStock(code) {
    const st = stockList.find((s, idx) => s.code === code || ('STK-' + String(idx + 1).padStart(2, '0')) === code);
    if (!st) return;

    const itemCode = st.code || code;
    document.getElementById('modal-stock-title').innerHTML = `<i data-lucide="edit-3" class="w-4 h-4 mr-2 text-indigo-400"></i> Edit Nilai Stok [${itemCode}]`;
    document.getElementById('stock-edit-original-code').value = itemCode;
    document.getElementById('stock-name').value = st.name;
    document.getElementById('stock-qty-text').value = st.qtyText || ((st.awal !== undefined) ? `${Number(st.awal) + Number(st.masuk) - Number(st.keluar)} ${st.unit || 'Pcs'}` : '');
    document.getElementById('stock-value-rp').value = st.valueRp || '';
    document.getElementById('stock-kondisi').value = st.kondisi || 'Aman';

    openModal('modal-stock-form');
}

function handleSaveStock(e) {
    e.preventDefault();
    const origCode = document.getElementById('stock-edit-original-code').value;
    const name = document.getElementById('stock-name').value.trim();
    const qtyText = document.getElementById('stock-qty-text').value.trim();
    const valueRp = Number(document.getElementById('stock-value-rp').value || 0);
    const kondisi = document.getElementById('stock-kondisi').value;

    if (origCode) {
        const idx = stockList.findIndex((s, i) => s.code === origCode || ('STK-' + String(i + 1).padStart(2, '0')) === origCode);
        if (idx !== -1) {
            stockList[idx] = {
                ...stockList[idx],
                name: name,
                qtyText: qtyText,
                valueRp: valueRp,
                kondisi: kondisi
            };
        }
    } else {
        const nextCode = 'STK-' + String(stockList.length + 1).padStart(2, '0');
        stockList.push({
            code: nextCode,
            name: name,
            qtyText: qtyText,
            valueRp: valueRp,
            kondisi: kondisi
        });
    }

    saveToLocalStorage();
    closeModal('modal-stock-form');
    e.target.reset();
    renderDashboard();
    showToast('✅ Posisi & nilai stok berhasil disimpan!');
}

function deleteStock(code) {
    const st = stockList.find((s, idx) => s.code === code || ('STK-' + String(idx + 1).padStart(2, '0')) === code);
    if (!st) return;

    if (confirm(`Apakah Anda yakin ingin menghapus item stok [${st.code || code}] ${st.name}?`)) {
        stockList = stockList.filter((s, idx) => s.code !== code && ('STK-' + String(idx + 1).padStart(2, '0')) !== code);
        saveToLocalStorage();
        renderDashboard();
    }
}

function editGudangNotes() {
    const raw = prompt('Edit Catatan Gudang & Log (pisahkan setiap poin dengan tanda enter atau nomor):', gudangNotes.join('\n'));
    if (raw !== null) {
        gudangNotes = raw.split('\n').filter(s => s.trim().length > 0);
        saveToLocalStorage();
        renderStockTable();
    }
}

// ================= CHARTS ENGINE =================
function initCharts() {
    const ctxTrend = document.getElementById('chartTrendSales').getContext('2d');
    chartTrendInstance = new Chart(ctxTrend, {
        type: 'bar',
        data: {
            labels: ['Aki & Baterai', 'Oli & Pelumas', 'Ban & Aksesori', 'Sparepart Mesin', 'Jasa Servis'],
            datasets: [
                {
                    label: 'Shop & Drive (Rp)',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(220, 38, 38, 0.85)',
                    borderRadius: 4
                },
                {
                    label: 'Bima Motor (Rp)',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(37, 99, 235, 0.85)',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { size: 11, family: 'Inter' } } },
                tooltip: {
                    callbacks: {
                        label: function(c) {
                            return `${c.dataset.label}: ${formatRupiah(c.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(v) { return 'Rp ' + (v / 1000000) + ' Jt'; },
                        font: { size: 10 }
                    }
                },
                x: {
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });

    const ctxCat = document.getElementById('chartCategoryShare').getContext('2d');
    chartCategoryInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: ['Aki', 'Oli', 'Ban', 'Sparepart', 'Jasa Servis'],
            datasets: [{
                data: [1, 1, 1, 1, 1],
                backgroundColor: [
                    '#4f46e5',
                    '#0284c7',
                    '#059669',
                    '#d97706',
                    '#dc2626'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 10, family: 'Inter' } } },
                tooltip: {
                    callbacks: {
                        label: function(c) {
                            return `${c.label}: ${formatRupiah(c.raw)}`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

function updateCharts(agg) {
    if (chartTrendInstance) {
        chartTrendInstance.data.datasets[0].data = [
            agg.aki.sd, agg.oli.sd, agg.ban.sd, agg.part.sd, agg.jasa.sd
        ];
        chartTrendInstance.data.datasets[1].data = [
            agg.aki.bm, agg.oli.bm, agg.ban.bm, agg.part.bm, agg.jasa.bm
        ];
        chartTrendInstance.update();
    }

    if (chartCategoryInstance) {
        chartCategoryInstance.data.datasets[0].data = [
            agg.aki.sd + agg.aki.bm,
            agg.oli.sd + agg.oli.bm,
            agg.ban.sd + agg.ban.bm,
            agg.part.sd + agg.part.bm,
            agg.jasa.sd + agg.jasa.bm
        ];
        chartCategoryInstance.update();
    }
}

// ================= MODAL HELPERS =================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        lucide.createIcons();
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active', 'border-indigo-600', 'text-indigo-600');
        b.classList.add('border-transparent', 'text-slate-600');
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');

    const navBtn = document.getElementById(`nav-${tabId}`);
    if (navBtn) {
        navBtn.classList.add('active', 'border-indigo-600', 'text-indigo-600');
        navBtn.classList.remove('border-transparent', 'text-slate-600');
    }
    lucide.createIcons();
}

// ================= EXPORT TO EXCEL =================
function exportToExcel() {
    const wb = XLSX.utils.book_new();

    // 1. Data Ringkasan Laba Rugi Komparatif
    const wsLabaRugiData = [
        ['LAPORAN REKAPITULASI KEUANGAN TERPADU'],
        ['Konsolidasi Unit Usaha Shop & Drive dan Bima Motor'],
        [`Periode: ${filterStartDate} s/d ${filterEndDate}`],
        [],
        ['KOMPONEN AKUN FINANSIAL', 'SHOP & DRIVE (RP)', 'BIMA MOTOR (RP)', 'TOTAL KONSOLIDASI (RP)']
    ];

    const agg = {
        aki: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        oli: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        ban: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        part: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        jasa: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 }
    };

    transactions.filter(t => t.date >= filterStartDate && t.date <= filterEndDate).forEach(t => {
        if (agg[t.category]) {
            if (t.unit === 'SD') {
                agg[t.category].sd += Number(t.amount);
                agg[t.category].cogs_sd += Number(t.cogs || 0);
            } else if (t.unit === 'BM') {
                agg[t.category].bm += Number(t.amount);
                agg[t.category].cogs_bm += Number(t.cogs || 0);
            }
        }
    });

    const sales_sd = agg.aki.sd + agg.oli.sd + agg.ban.sd + agg.part.sd + agg.jasa.sd;
    const sales_bm = agg.aki.bm + agg.oli.bm + agg.ban.bm + agg.part.bm + agg.jasa.bm;
    const total_sales = sales_sd + sales_bm;

    // HPP / Modal dari Pembayaran Faktur Suplier Astra
    let cogs_sd = 0, cogs_bm = 0;
    fakturList.filter(f => f.date >= filterStartDate && f.date <= filterEndDate).forEach(f => {
        const u = (f.unit || '').toLowerCase();
        if (u.includes('shop') || u === 'sd') cogs_sd += Number(f.amount || 0);
        else if (u.includes('bima') || u === 'bm') cogs_bm += Number(f.amount || 0);
    });
    const total_cogs = cogs_sd + cogs_bm;

    const gross_profit_sd = sales_sd - cogs_sd;
    const gross_profit_bm = sales_bm - cogs_bm;
    const total_gross_profit = total_sales - total_cogs;

    let opex_sd = 0, opex_bm = 0;
    opexList.forEach(op => {
        opex_sd += Number(op.sd || 0);
        opex_bm += Number(op.bm || 0);
    });
    const total_opex = opex_sd + opex_bm;

    const net_profit_sd = gross_profit_sd - opex_sd;
    const net_profit_bm = gross_profit_bm - opex_bm;
    const total_net_profit = total_gross_profit - total_opex;

    wsLabaRugiData.push(
        ['A. PENDAPATAN / PENJUALAN KOTOR', '', '', ''],
        ['1. Penjualan Aki & Baterai', agg.aki.sd, agg.aki.bm, agg.aki.sd + agg.aki.bm],
        ['2. Penjualan Oli & Pelumas', agg.oli.sd, agg.oli.bm, agg.oli.sd + agg.oli.bm],
        ['3. Penjualan Ban & Aksesori', agg.ban.sd, agg.ban.bm, agg.ban.sd + agg.ban.bm],
        ['4. Penjualan Sparepart Mesin', agg.part.sd, agg.part.bm, agg.part.sd + agg.part.bm],
        ['5. Jasa Servis Ringan & Pasang', agg.jasa.sd, agg.jasa.bm, agg.jasa.sd + agg.jasa.bm],
        ['TOTAL PENDAPATAN / PENJUALAN (1)', sales_sd, sales_bm, total_sales],
        ['B. HARGA POKOK PENJUALAN (HPP FAKTUR ASTRA)', cogs_sd, cogs_bm, total_cogs],
        ['LABA KOTOR PENJUALAN (1 - B)', gross_profit_sd, gross_profit_bm, total_gross_profit],
        ['C. BIAYA OPERASIONAL & PEMBAYARAN GAJI (OPEX)', '', '', '']
    );

    opexList.forEach(op => {
        const sd = Number(op.sd || 0);
        const bm = Number(op.bm || 0);
        wsLabaRugiData.push([op.name, sd, bm, sd + bm]);
    });

    wsLabaRugiData.push(
        ['TOTAL BIAYA OPERASIONAL & GAJI (C)', opex_sd, opex_bm, total_opex],
        ['TOTAL LABA BERSIH AKHIR (1 - B - C)', net_profit_sd, net_profit_bm, total_net_profit]
    );

    const wsLabaRugi = XLSX.utils.aoa_to_sheet(wsLabaRugiData);
    XLSX.utils.book_append_sheet(wb, wsLabaRugi, 'Laba Rugi Komparatif');

    // 2. Biaya Operasional & Gaji Sheet
    const wsOpexData = [
        ['KODE', 'RINCIAN POS BIAYA OPERASIONAL & GAJI', 'SHOP & DRIVE (RP)', 'BIMA MOTOR (RP)', 'TOTAL KONSOLIDASI (RP)']
    ];
    opexList.forEach((op, idx) => {
        const code = op.code || ('OPX-' + String(idx + 1).padStart(2, '0'));
        const sd = Number(op.sd || 0);
        const bm = Number(op.bm || 0);
        wsOpexData.push([code, op.name, sd, bm, sd + bm]);
    });
    wsOpexData.push(['', 'TOTAL BIAYA OPERASIONAL & GAJI', opex_sd, opex_bm, total_opex]);
    const wsOpex = XLSX.utils.aoa_to_sheet(wsOpexData);
    XLSX.utils.book_append_sheet(wb, wsOpex, 'Biaya Operasional & Gaji');

    // 3. Faktur Astra Sheet
    const wsFakturData = [
        ['TANGGAL', 'UNIT USAHA', 'NO. FAKTUR', 'RINCIAN PEMBELIAN', 'METODE', 'BAYAR (RP)', 'STATUS']
    ];
    fakturList.forEach(f => {
        wsFakturData.push([f.date, f.unit, f.no, f.desc, f.method, f.amount, f.status]);
    });
    const wsFaktur = XLSX.utils.aoa_to_sheet(wsFakturData);
    XLSX.utils.book_append_sheet(wb, wsFaktur, 'Faktur Astra');

    // 4. Stok Gudang Sheet
    const wsStockData = [
        ['KODE', 'NAMA & RINCIAN BARANG', 'POSISI STOK FISIK', 'NILAI VALUE (RP)', 'KONDISI / STATUS']
    ];
    stockList.forEach((s, idx) => {
        const code = s.code || ('STK-' + String(idx + 1).padStart(2, '0'));
        const qtyText = s.qtyText || ((s.awal !== undefined) ? `${Number(s.awal)+Number(s.masuk)-Number(s.keluar)} ${s.unit||'Pcs'}` : '-');
        wsStockData.push([code, s.name, qtyText, s.valueRp || 0, s.kondisi || 'Aman']);
    });
    const wsStock = XLSX.utils.aoa_to_sheet(wsStockData);
    XLSX.utils.book_append_sheet(wb, wsStock, 'Stok Gudang');

    XLSX.writeFile(wb, `Laporan_Bengkel_Terpadu_${filterStartDate}_sd_${filterEndDate}.xlsx`);
}

// ================= OFFICIAL A4 REPORT GENERATOR & PDF ENGINE =================
function generateOfficialReportHtml() {
    // 1. Compute exact aggregated values for current date filter
    const agg = {
        aki: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        oli: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        ban: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        part: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 },
        jasa: { sd: 0, bm: 0, cogs_sd: 0, cogs_bm: 0 }
    };

    transactions.filter(t => t.date >= filterStartDate && t.date <= filterEndDate).forEach(t => {
        if (agg[t.category]) {
            if (t.unit === 'SD') {
                agg[t.category].sd += Number(t.amount);
                agg[t.category].cogs_sd += Number(t.cogs || 0);
            } else if (t.unit === 'BM') {
                agg[t.category].bm += Number(t.amount);
                agg[t.category].cogs_bm += Number(t.cogs || 0);
            }
        }
    });

    const sales_sd = agg.aki.sd + agg.oli.sd + agg.ban.sd + agg.part.sd + agg.jasa.sd;
    const sales_bm = agg.aki.bm + agg.oli.bm + agg.ban.bm + agg.part.bm + agg.jasa.bm;
    const total_sales = sales_sd + sales_bm;

    // HPP / Modal dari Pembayaran Faktur Suplier Astra
    let cogs_sd = 0, cogs_bm = 0;
    fakturList.filter(f => f.date >= filterStartDate && f.date <= filterEndDate).forEach(f => {
        const u = (f.unit || '').toLowerCase();
        if (u.includes('shop') || u === 'sd') cogs_sd += Number(f.amount || 0);
        else if (u.includes('bima') || u === 'bm') cogs_bm += Number(f.amount || 0);
    });
    const total_cogs = cogs_sd + cogs_bm;

    const gross_profit_sd = sales_sd - cogs_sd;
    const gross_profit_bm = sales_bm - cogs_bm;
    const total_gross_profit = total_sales - total_cogs;

    let opex_sd = 0, opex_bm = 0;
    opexList.forEach(op => {
        opex_sd += Number(op.sd || 0);
        opex_bm += Number(op.bm || 0);
    });
    const total_opex = opex_sd + opex_bm;

    const net_profit_sd = gross_profit_sd - opex_sd;
    const net_profit_bm = gross_profit_bm - opex_bm;
    const total_net_profit = total_gross_profit - total_opex;

    const sdRatio = total_sales > 0 ? Math.round((sales_sd / total_sales) * 100) : 0;
    const bmRatio = total_sales > 0 ? (100 - sdRatio) : 0;
    const cogsPct = total_sales > 0 ? ((total_cogs / total_sales) * 100).toFixed(1) : '0.0';
    const netMargin = total_sales > 0 ? ((total_net_profit / total_sales) * 100).toFixed(1) : '0.0';

    return `
        <!-- HALAMAN 1 (UKURAN A4) -->
        <div class="a4-page-sheet" id="doc-page-1" style="font-family: 'Inter', -apple-system, sans-serif; color: #0f172a; line-height: 1.35; font-size: 9.5px;">
            
            <!-- HEADER KOP LAPORAN -->
            <div style="border-bottom: 2px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <div style="font-size: 8px; font-weight: 800; color: #4f46e5; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 2px;">
                        KONSOLIDASI FINANSIAL BENGKEL TERPADU
                    </div>
                    <h1 style="font-size: 15px; font-weight: 900; margin: 0; color: #0f172a; letter-spacing: -0.2px; text-transform: uppercase;">
                        LAPORAN REKAPITULASI KEUANGAN TERPADU
                    </h1>
                    <div style="font-size: 10px; color: #475569; margin-top: 2px; font-weight: 600;">
                        Unit Usaha: <span style="color: #dc2626; font-weight: 800;">Shop & Drive</span> & <span style="color: #2563eb; font-weight: 800;">Bima Motor</span>
                    </div>
                </div>
                <div style="text-align: right; font-size: 9px; color: #334155; line-height: 1.45; background: #f8fafc; padding: 6px 10px; border-radius: 4px; border: 1px solid #e2e8f0;">
                    <div>Periode: <strong style="color: #0f172a;">${formatIndoDate(filterStartDate)} s/d ${formatIndoDate(filterEndDate)}</strong></div>
                    <div>Status: <span style="color: #059669; font-weight: 800;">● Final Terverifikasi</span> | Mata Uang: <strong>IDR (Rp)</strong></div>
                </div>
            </div>

            <!-- RINGKASAN EKSEKUTIF / 4 KPI UTAMA -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
                <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px; background: #f8fafc;">
                    <div style="font-size: 7.5px; font-weight: 800; color: #64748b; text-transform: uppercase;">TOTAL PENJUALAN</div>
                    <div style="font-size: 13px; font-weight: 900; color: #0f172a; margin: 2px 0;">${formatRupiah(total_sales)}</div>
                    <div style="font-size: 7.5px; color: #64748b;">S&D: ${sdRatio}% | BM: ${bmRatio}%</div>
                </div>
                <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px; background: #f8fafc;">
                    <div style="font-size: 7.5px; font-weight: 800; color: #64748b; text-transform: uppercase;">HPP / FAKTUR ASTRA</div>
                    <div style="font-size: 13px; font-weight: 900; color: #0f172a; margin: 2px 0;">${formatRupiah(total_cogs)}</div>
                    <div style="font-size: 7.5px; color: #64748b;">${cogsPct}% dari omset</div>
                </div>
                <div style="border: 1px solid #fee2e2; border-radius: 6px; padding: 7px 9px; background: #fff5f5;">
                    <div style="font-size: 7.5px; font-weight: 800; color: #991b1b; text-transform: uppercase;">BIAYA OPERASIONAL & GAJI</div>
                    <div style="font-size: 13px; font-weight: 900; color: #dc2626; margin: 2px 0;">${formatRupiah(total_opex)}</div>
                    <div style="font-size: 7.5px; color: #b91c1c;">S&D & Bima Motor</div>
                </div>
                <div style="border: 1px solid #0f172a; border-radius: 6px; padding: 7px 9px; background: #0f172a; color: white;">
                    <div style="font-size: 7.5px; font-weight: 800; color: #cbd5e1; text-transform: uppercase;">LABA BERSIH AKHIR</div>
                    <div style="font-size: 13px; font-weight: 900; color: #34d399; margin: 2px 0;">${formatRupiah(total_net_profit)}</div>
                    <div style="font-size: 7.5px; color: #94a3b8;">Net Margin: ${netMargin}%</div>
                </div>
            </div>

            <!-- TABEL I: REKAPITULASI PENDAPATAN & LABA PENJUALAN KOMPARATIF -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                <div style="font-weight: 900; font-size: 9.5px; text-transform: uppercase; color: #0f172a; letter-spacing: 0.3px;">
                    I. REKAPITULASI PENDAPATAN & LABA RUGI KOMPARATIF
                </div>
                <div style="font-size: 8px; color: #64748b; font-weight: 600;">(Semua Nilai dalam Rupiah)</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; margin-bottom: 12px; border: 1px solid #cbd5e1;">
                <thead>
                    <tr style="background: #f1f5f9; text-align: left; font-weight: 800; border-bottom: 1.5px solid #94a3b8; color: #334155;">
                        <th style="padding: 4px 6px; width: 43%;">KOMPONEN AKUN FINANSIAL</th>
                        <th style="padding: 4px 6px; text-align: right; width: 19%; color: #dc2626;">SHOP & DRIVE (RP)</th>
                        <th style="padding: 4px 6px; text-align: right; width: 19%; color: #2563eb;">BIMA MOTOR (RP)</th>
                        <th style="padding: 4px 6px; text-align: right; width: 19%; color: #0f172a;">TOTAL KONSOLIDASI (RP)</th>
                    </tr>
                </thead>
                <tbody style="font-variant-numeric: tabular-nums;">
                    <tr style="background: #f8fafc; font-weight: 800; color: #1e293b; border-bottom: 1px solid #e2e8f0;">
                        <td colspan="4" style="padding: 3px 6px;">A. PENDAPATAN / PENJUALAN KOTOR</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">1. Penjualan Aki & Baterai (GS Astra, Incoe)</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.aki.sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.aki.bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700;">${formatRupiahPlain(agg.aki.sd + agg.aki.bm)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">2. Penjualan Oli & Pelumas (Shell, Pertamina, Motul)</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.oli.sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.oli.bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700;">${formatRupiahPlain(agg.oli.sd + agg.oli.bm)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">3. Penjualan Ban & Aksesori Tambahan</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.ban.sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.ban.bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700;">${formatRupiahPlain(agg.ban.sd + agg.ban.bm)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">4. Penjualan Sparepart / Suku Cadang Mesin</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.part.sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.part.bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700;">${formatRupiahPlain(agg.part.sd + agg.part.bm)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">5. Jasa Servis Ringan, Pasang & Tune-Up</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.jasa.sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(agg.jasa.bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700;">${formatRupiahPlain(agg.jasa.sd + agg.jasa.bm)}</td>
                    </tr>
                    <tr style="border-top: 1.5px solid #64748b; border-bottom: 1.5px solid #64748b; font-weight: 900; background: #e2e8f0; color: #0f172a;">
                        <td style="padding: 3.5px 6px;">TOTAL PENDAPATAN / PENJUALAN (1)</td>
                        <td style="padding: 3.5px 6px; text-align: right;">${formatRupiahPlain(sales_sd)}</td>
                        <td style="padding: 3.5px 6px; text-align: right;">${formatRupiahPlain(sales_bm)}</td>
                        <td style="padding: 3.5px 6px; text-align: right;">${formatRupiahPlain(total_sales)}</td>
                    </tr>
                    
                    <tr style="background: #f8fafc; font-weight: 800; border-top: 1px solid #cbd5e1; color: #1e293b;">
                        <td colspan="4" style="padding: 3px 6px;">B. HARGA POKOK PENJUALAN (HPP FAKTUR ASTRA)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">Total Realisasi Pembayaran Pembelian Astra</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(cogs_sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right;">${formatRupiahPlain(cogs_bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700;">${formatRupiahPlain(total_cogs)}</td>
                    </tr>
                    <tr style="border-top: 1px solid #fde68a; border-bottom: 1px solid #fde68a; font-weight: 800; background: #fffbeb; color: #92400e;">
                        <td style="padding: 3px 6px;">LABA KOTOR PENJUALAN (1 - B)</td>
                        <td style="padding: 3px 6px; text-align: right;">${formatRupiahPlain(gross_profit_sd)}</td>
                        <td style="padding: 3px 6px; text-align: right;">${formatRupiahPlain(gross_profit_bm)}</td>
                        <td style="padding: 3px 6px; text-align: right; font-weight: 900;">${formatRupiahPlain(total_gross_profit)}</td>
                    </tr>

                    <tr style="background: #f8fafc; font-weight: 800; border-top: 1px solid #cbd5e1; color: #1e293b;">
                        <td colspan="4" style="padding: 3px 6px;">C. BIAYA OPERASIONAL & PEMBAYARAN GAJI (OPEX)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 2.5px 6px 2.5px 14px;">Total Pengeluaran Gaji Mekanik & Operasional Unit</td>
                        <td style="padding: 2.5px 6px; text-align: right; color: #dc2626;">${formatRupiahPlain(opex_sd)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; color: #dc2626;">${formatRupiahPlain(opex_bm)}</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-weight: 700; color: #991b1b;">${formatRupiahPlain(total_opex)}</td>
                    </tr>

                    <!-- TOTAL LABA BERSIH AKHIR (1 - B - C) -->
                    <tr style="border-top: 2px solid #0f172a; font-weight: 900; background: #0f172a; color: white;">
                        <td style="padding: 4.5px 6px; color: #34d399;">TOTAL LABA BERSIH AKHIR (1 - B - C)</td>
                        <td style="padding: 4.5px 6px; text-align: right; color: #34d399;">${formatRupiah(net_profit_sd)}</td>
                        <td style="padding: 4.5px 6px; text-align: right; color: #34d399;">${formatRupiah(net_profit_bm)}</td>
                        <td style="padding: 4.5px 6px; text-align: right; font-size: 10px; color: #34d399; font-weight: 900;">${formatRupiah(total_net_profit)}</td>
                    </tr>
                </tbody>
            </table>

            <!-- TABEL II: REKAPITULASI PEMBAYARAN FAKTUR SUPLIER ASTRA -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3px;">
                <div style="font-weight: 900; font-size: 9.5px; text-transform: uppercase; color: #0f172a; letter-spacing: 0.3px;">
                    II. REKAPITULASI PEMBAYARAN FAKTUR SUPLIER ASTRA (PER TANGGAL)
                </div>
                <div style="font-size: 7.5px; font-weight: 700; color: #475569;">DISTRIBUTOR: PT ASTRA OTOPARTS TBK</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 4px; border: 1px solid #cbd5e1;">
                <thead>
                    <tr style="background: #f1f5f9; text-align: left; font-weight: 800; border-bottom: 1.5px solid #94a3b8; color: #334155;">
                        <th style="padding: 3.5px 5px; text-align: center; width: 11%;">TANGGAL</th>
                        <th style="padding: 3.5px 5px; width: 13%;">UNIT</th>
                        <th style="padding: 3.5px 5px; width: 15%;">NO. FAKTUR</th>
                        <th style="padding: 3.5px 5px; width: 33%;">RINCIAN PEMBELIAN BARANG ASTRA</th>
                        <th style="padding: 3.5px 5px; width: 12%;">METODE</th>
                        <th style="padding: 3.5px 5px; text-align: right; width: 16%;">BAYAR (RP)</th>
                    </tr>
                </thead>
                <tbody style="font-variant-numeric: tabular-nums;">
                    ${fakturList.map((f, idx) => `
                        <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 1 ? '#fafafa' : '#ffffff'};">
                            <td style="padding: 2.5px 5px; text-align: center; color: #475569;">${formatIndoDate(f.date)}</td>
                            <td style="padding: 2.5px 5px; font-weight: 700; color: ${f.unit.includes('Shop') ? '#dc2626' : '#2563eb'};">${f.unit}</td>
                            <td style="padding: 2.5px 5px; font-family: monospace; font-weight: 700; color: #0f172a;">${f.no}</td>
                            <td style="padding: 2.5px 5px; color: #1e293b;">${f.desc}</td>
                            <td style="padding: 2.5px 5px; color: #475569;">${f.method}</td>
                            <td style="padding: 2.5px 5px; text-align: right; font-weight: 700; color: #0f172a;">${formatRupiahPlain(f.amount)}</td>
                        </tr>
                    `).join('')}
                    <tr style="border-top: 1.5px solid #64748b; font-weight: 900; background: #e2e8f0; color: #0f172a;">
                        <td colspan="5" style="padding: 3.5px 5px; text-align: right;">TOTAL PEMBAYARAN FAKTUR ASTRA</td>
                        <td style="padding: 3.5px 5px; text-align: right;">${formatRupiahPlain(fakturList.reduce((acc, x) => acc + Number(x.amount||0), 0))}</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="font-size: 7.5px; color: #b91c1c; margin-bottom: 8px; text-align: right; font-weight: 700; background: #fef2f2; padding: 2.5px 7px; border-radius: 3px; border: 1px solid #fecaca; display: inline-block; float: right;">
                *Sisa Tagihan Faktur Berjalan (INV-AST-0940 S&D): <strong>Rp 5.500.000</strong> (Jatuh Tempo: 05 Okt 2026)
            </div>
            <div style="clear: both;"></div>

            <!-- Page 1 Footer -->
            <div style="display: flex; justify-content: space-between; font-size: 7.5px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 4px; margin-top: auto;">
                <span>Sistem Rekapitulasi Keuangan Terpadu • Shop & Drive & Bima Motor</span>
                <span style="font-weight: 700;">Halaman 1 dari 2</span>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- HALAMAN 2 (UKURAN A4) -->
        <div class="a4-page-sheet" id="doc-page-2" style="font-family: 'Inter', -apple-system, sans-serif; color: #0f172a; line-height: 1.35; font-size: 9.5px;">
            
            <!-- MINI HEADER HALAMAN 2 -->
            <div style="border-bottom: 1.5px solid #1e293b; padding-bottom: 5px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 7.5px; font-weight: 800; color: #4f46e5; text-transform: uppercase;">LAMPIRAN RINCIAN OPERASIONAL, STOK & OTORISASI</span>
                    <h2 style="font-size: 12.5px; font-weight: 900; margin: 0; color: #0f172a;">LAPORAN REKAPITULASI KEUANGAN TERPADU</h2>
                </div>
                <div style="font-size: 8px; color: #475569; text-align: right;">
                    Periode: <strong>${formatIndoDate(filterStartDate)} s/d ${formatIndoDate(filterEndDate)}</strong>
                </div>
            </div>

            <!-- TABEL III: REKAPITULASI RINCIAN BIAYA OPERASIONAL & GAJI PER UNIT -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3px;">
                <div style="font-weight: 900; font-size: 9.5px; text-transform: uppercase; color: #0f172a; letter-spacing: 0.3px;">
                    III. RINCIAN BIAYA OPERASIONAL & PEMBAYARAN GAJI (OPEX) PER UNIT
                </div>
                <div style="font-size: 7.5px; color: #64748b; font-weight: 600;">(Realisasi Beban Operasional)</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px; border: 1px solid #cbd5e1;">
                <thead>
                    <tr style="background: #f1f5f9; text-align: left; font-weight: 800; border-bottom: 1.5px solid #94a3b8; color: #334155;">
                        <th style="padding: 3.5px 5px; text-align: center; width: 10%;">KODE</th>
                        <th style="padding: 3.5px 5px; width: 42%;">RINCIAN POS BIAYA OPERASIONAL & GAJI</th>
                        <th style="padding: 3.5px 5px; text-align: right; width: 16%; color: #dc2626;">SHOP & DRIVE (RP)</th>
                        <th style="padding: 3.5px 5px; text-align: right; width: 16%; color: #2563eb;">BIMA MOTOR (RP)</th>
                        <th style="padding: 3.5px 5px; text-align: right; width: 16%; color: #0f172a;">TOTAL (RP)</th>
                    </tr>
                </thead>
                <tbody style="font-variant-numeric: tabular-nums;">
                    ${opexList.map((op, idx) => {
                        const code = op.code || ('OPX-' + String(idx + 1).padStart(2, '0'));
                        const sd = Number(op.sd || 0);
                        const bm = Number(op.bm || 0);
                        return `
                            <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 1 ? '#fafafa' : '#ffffff'};">
                                <td style="padding: 2.5px 5px; text-align: center; font-weight: 700; color: #475569;">${code}</td>
                                <td style="padding: 2.5px 5px; font-weight: 600; color: #1e293b;">${op.name}</td>
                                <td style="padding: 2.5px 5px; text-align: right; color: #dc2626; font-weight: 600;">${formatRupiahPlain(sd)}</td>
                                <td style="padding: 2.5px 5px; text-align: right; color: #2563eb; font-weight: 600;">${formatRupiahPlain(bm)}</td>
                                <td style="padding: 2.5px 5px; text-align: right; font-weight: 700; color: #0f172a;">${formatRupiahPlain(sd + bm)}</td>
                            </tr>
                        `;
                    }).join('')}
                    <tr style="border-top: 1.5px solid #64748b; font-weight: 900; background: #fee2e2; color: #991b1b;">
                        <td colspan="2" style="padding: 3.5px 5px; text-align: right;">TOTAL BIAYA OPERASIONAL & GAJI (C)</td>
                        <td style="padding: 3.5px 5px; text-align: right; color: #b91c1c;">${formatRupiahPlain(opex_sd)}</td>
                        <td style="padding: 3.5px 5px; text-align: right; color: #b91c1c;">${formatRupiahPlain(opex_bm)}</td>
                        <td style="padding: 3.5px 5px; text-align: right; font-weight: 900; color: #7f1d1d;">${formatRupiahPlain(total_opex)}</td>
                    </tr>
                </tbody>
            </table>

            <!-- TABEL IV: REKAPITULASI POSISI STOK GUDANG -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3px;">
                <div style="font-weight: 900; font-size: 9.5px; text-transform: uppercase; color: #0f172a; letter-spacing: 0.3px;">
                    IV. REKAPITULASI POSISI & VALUASI STOK GUDANG (FREE TEXT)
                </div>
                <div style="font-size: 7.5px; color: #64748b; font-weight: 600;">(Audit Fisik & Nilai Value)</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px; border: 1px solid #cbd5e1;">
                <thead>
                    <tr style="background: #f1f5f9; text-align: left; font-weight: 800; border-bottom: 1.5px solid #94a3b8; color: #334155;">
                        <th style="padding: 3.5px 5px; text-align: center; width: 9%;">KODE</th>
                        <th style="padding: 3.5px 5px; width: 44%;">NAMA & RINCIAN BARANG (FREE TEXT)</th>
                        <th style="padding: 3.5px 5px; text-align: center; width: 17%;">POSISI STOK FISIK</th>
                        <th style="padding: 3.5px 5px; text-align: right; width: 18%;">NILAI VALUE (RP)</th>
                        <th style="padding: 3.5px 5px; text-align: center; width: 12%;">STATUS</th>
                    </tr>
                </thead>
                <tbody style="font-variant-numeric: tabular-nums;">
                    ${stockList.map((s, idx) => {
                        const code = s.code || ('STK-' + String(idx + 1).padStart(2, '0'));
                        const qtyText = s.qtyText || ((s.awal !== undefined) ? `${Number(s.awal)+Number(s.masuk)-Number(s.keluar)} ${s.unit||'Pcs'}` : '-');
                        const valText = s.valueRp ? formatRupiahPlain(s.valueRp) : '-';
                        return `
                            <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 1 ? '#fafafa' : '#ffffff'};">
                                <td style="padding: 2.5px 5px; text-align: center; font-weight: 700; color: #475569;">${code}</td>
                                <td style="padding: 2.5px 5px; font-weight: 600; color: #1e293b;">${s.name}</td>
                                <td style="padding: 2.5px 5px; text-align: center; font-weight: 700; color: #312e81;">${qtyText}</td>
                                <td style="padding: 2.5px 5px; text-align: right; font-weight: 700; color: #065f46;">${valText !== '-' ? 'Rp ' + valText : '-'}</td>
                                <td style="padding: 2.5px 5px; text-align: center; font-weight: 600; color: ${s.kondisi === 'Aman' ? '#059669' : (s.kondisi === 'Cukup' ? '#d97706' : '#dc2626')};">${s.kondisi || 'Aman'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <!-- CATATAN LOG CEPAT GUDANG -->
            <div style="border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 10px; margin-bottom: 12px; background: #f8fafc; font-size: 8px; line-height: 1.45;">
                <div style="font-weight: 800; text-transform: uppercase; margin-bottom: 3px; color: #0f172a; font-size: 8px;">
                    📋 CATATAN LOG CEPAT GUDANG & RENCANA PENGADAAN (FREE TEXT)
                </div>
                ${gudangNotes.map(n => `<div style="color: #334155; margin-bottom: 2px;">• ${n}</div>`).join('')}
            </div>

            <!-- TANDA TANGAN / OTORISASI (HANYA PEMBUAT) -->
            <div style="margin-bottom: 12px; width: 290px;">
                <div style="border: 1.5px solid #94a3b8; padding: 6px 12px; border-radius: 4px; height: 68px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; background: #f8fafc;">
                    <div style="font-weight: 800; color: #475569; font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.5px;">
                        DIBUAT DAN HANYA UNTUK PEMAKAIAN SENDIRI
                    </div>
                    <div>
                        <div style="font-weight: 900; font-size: 10.5px; color: #0f172a;">[ PROF. DR. GG NUSWANTORO ]</div>
                        <div style="font-size: 7.5px; color: #64748b;">Tanggal: ${formatIndoDate(reportSignDate)}</div>
                    </div>
                </div>
            </div>

            <!-- Page 2 Footer -->
            <div style="display: flex; justify-content: space-between; font-size: 7.5px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 4px; margin-top: auto;">
                <span>Sistem Rekapitulasi Keuangan Terpadu • Shop & Drive & Bima Motor</span>
                <span style="font-weight: 700;">Halaman 2 dari 2</span>
            </div>
        </div>
    `;
}


// ================= PRATINJAU & SIMPAN PDF (A4) =================

function openPdfPreviewModal() {
    const previewContainer = document.getElementById('pdf-preview-content');
    if (previewContainer) {
        previewContainer.innerHTML = generateOfficialReportHtml();
    }
    openModal('modal-pdf-preview');
}

// ================= UNDUH / SIMPAN FILE PDF A4 =================
function downloadPdfDocument() {
    const btn = document.getElementById('btn-save-pdf-action');
    const originalText = btn ? btn.innerHTML : '';
    
    if (btn) {
        btn.innerHTML = '<span class="inline-block animate-spin mr-1.5">⏳</span> Menyusun PDF A4...';
        btn.disabled = true;
    }

    const previewContainer = document.getElementById('pdf-preview-content');
    if (!previewContainer || !previewContainer.innerHTML.trim()) {
        previewContainer.innerHTML = generateOfficialReportHtml();
    }

    const filename = `Laporan_Rekapitulasi_Keuangan_${filterStartDate}_sd_${filterEndDate}.pdf`;

    const opt = {
        margin: [8, 10, 8, 10], // mm
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            logging: false 
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    if (window.html2pdf) {
        html2pdf().set(opt).from(previewContainer).save()
            .then(() => {
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
                showToast(`📄 File PDF A4 berhasil diunduh: ${filename}`);
            })
            .catch(err => {
                console.error('PDF generation error:', err);
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
                // Fallback to print
                window.print();
            });
    } else {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
        window.print();
    }
}

// ================= CETAK DOKUMEN VIA BROWSER =================
function printOfficialReport() {
    const printArea = document.getElementById('print-area');
    if (printArea) {
        printArea.innerHTML = generateOfficialReportHtml();
    }
    window.print();
}

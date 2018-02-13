/**
 * @license jqGrid Indonesian Translation
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(a,t){return void 0===t&&(t="undefined"!=typeof window?require("jquery"):require("jquery")(a||window)),e(t),t}:e(jQuery)}(function(e){"use strict";var a={isRTL:!1,defaults:{recordtext:"Data {0} - {1} dari {2}",emptyrecords:"Tidak ada data",loadtext:"Memuat...",pgtext:"Halaman {0} dari {1}",pgfirst:"First Page",pglast:"Last Page",pgnext:"Next Page",pgprev:"Previous Page",pgrecs:"Records per Page",showhide:"Toggle Expand Collapse Grid",savetext:"Menyimpan..."},search:{caption:"Pencarian",Find:"Cari !",Reset:"Segarkan",odata:[{oper:"eq",text:"sama dengan"},{oper:"ne",text:"tidak sama dengan"},{oper:"lt",text:"kurang dari"},{oper:"le",text:"kurang dari atau sama dengan"},{oper:"gt",text:"lebih besar"},{oper:"ge",text:"lebih besar atau sama dengan"},{oper:"bw",text:"dimulai dengan"},{oper:"bn",text:"tidak dimulai dengan"},{oper:"in",text:"di dalam"},{oper:"ni",text:"tidak di dalam"},{oper:"ew",text:"diakhiri dengan"},{oper:"en",text:"tidak diakhiri dengan"},{oper:"cn",text:"mengandung"},{oper:"nc",text:"tidak mengandung"},{oper:"nu",text:"is null"},{oper:"nn",text:"is not null"}],groupOps:[{op:"AND",text:"all"},{op:"OR",text:"any"}],addGroupTitle:"Add subgroup",deleteGroupTitle:"Delete group",addRuleTitle:"Add rule",deleteRuleTitle:"Delete rule",operandTitle:"Click to select search operation.",resetTitle:"Reset Search Value"},edit:{addCaption:"Tambah Data",editCaption:"Sunting Data",bSubmit:"Submit",bCancel:"Tutup",bClose:"Tutup",saveData:"Data telah berubah! Simpan perubahan?",bYes:"Ya",bNo:"Tidak",bExit:"Tutup",msg:{required:"kolom wajib diisi",number:"hanya nomer yang diperbolehkan",minValue:"kolom harus lebih besar dari atau sama dengan",maxValue:"kolom harus lebih kecil atau sama dengan",email:"alamat e-mail tidak valid",integer:"hanya nilai integer yang diperbolehkan",date:"nilai tanggal tidak valid",url:"Bukan URL yang valid. Harap gunakan ('http://' or 'https://')",nodefined:" belum didefinisikan!",novalue:" return value is required!",customarray:"Custom function should return array!",customfcheck:"Custom function should be present in case of custom checking!"}},view:{caption:"Menampilkan data",bClose:"Tutup"},del:{caption:"Hapus",msg:"Hapus data terpilih?",bSubmit:"Hapus",bCancel:"Batalkan"},nav:{edittext:"",edittitle:"Sunting data terpilih",addtext:"",addtitle:"Tambah baris baru",deltext:"",deltitle:"Hapus baris terpilih",searchtext:"",searchtitle:"Temukan data",refreshtext:"",refreshtitle:"Segarkan Grid",alertcap:"Warning",alerttext:"Harap pilih baris",viewtext:"",viewtitle:"Tampilkan baris terpilih",savetext:"",savetitle:"Save row",canceltext:"",canceltitle:"Cancel row editing"},col:{caption:"Pilih Kolom",bSubmit:"Ok",bCancel:"Batal"},errors:{errcap:"Error",nourl:"Tidak ada url yang diset",norecords:"Tidak ada data untuk diproses",model:"Lebar dari colNames <> colModel!"},formatter:{integer:{thousandsSeparator:".",defaultValue:"0"},number:{decimalSeparator:",",thousandsSeparator:".",decimalPlaces:2,defaultValue:"0"},currency:{decimalSeparator:",",thousandsSeparator:".",decimalPlaces:2,prefix:"Rp. ",suffix:"",defaultValue:"0"},date:{dayNames:["Ming","Sen","Sel","Rab","Kam","Jum","Sab","Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],monthNames:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],AmPm:["am","pm","AM","PM"],S:function(e){return e<11||e>13?["st","nd","rd","th"][Math.min((e-1)%10,3)]:"th"},srcformat:"Y-m-d",newformat:"n/j/Y",masks:{ShortDate:"n/j/Y",LongDate:"l, F d, Y",FullDateTime:"l, F d, Y g:i:s A",MonthDay:"F d",ShortTime:"g:i A",LongTime:"g:i:s A",YearMonth:"F, Y"}}}};e.jgrid=e.jgrid||{},e.extend(!0,e.jgrid,{defaults:{locale:"id"},locales:{id:e.extend({},a,{name:"Bahasa Indonesia",nameEnglish:"Indonesian"}),"id-ID":e.extend({},a,{name:"Bahasa Indonesia (Indonesia)",nameEnglish:"Indonesian (Indonesia)"})}})});
//# sourceMappingURL=grid.locale-id.js.map
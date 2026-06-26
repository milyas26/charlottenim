import { Work, Chapter } from "./types";

export const works: Work[] = [
  {
    id: 1,
    title: "Senja di Ujung Maret",
    slug: "senja-di-ujung-maret",
    synopsis:
      "Raya tidak pernah menyangka pertemuannya dengan Arga di perpustakaan kampus akan mengubah seluruh hidupnya. Di antara halaman buku dan senja bulan Maret, mereka menemukan bahwa cinta kadang datang dari tempat yang paling tak terduga.",
    coverUrl: "/covers/senja-maret.jpg",
    genres: ["Romance", "Slice of Life", "Campus"],
    status: "ONGOING",
    totalChapters: 3,
  },
  {
    id: 2,
    title: "Dua Detik Sebelum Kamu",
    slug: "dua-detik-sebelum-kamu",
    synopsis:
      "Aksara memiliki kemampuan unik: ia bisa melihat dua detik ke masa depan. Kemampuan yang menurutnya tidak berguna, sampai ia bertemu Senja—gadis yang masa depannya selalu kosong setiap kali Aksara mencoba melihat.",
    coverUrl: "/covers/dua-detik.jpg",
    genres: ["Fantasy", "Romance", "Mystery"],
    status: "COMPLETED",
    totalChapters: 3,
  },
];

export const chapters: Chapter[] = [
  {
    id: 1,
    workId: 1,
    workSlug: "senja-di-ujung-maret",
    chapterNumber: 1,
    slug: "pertemuan-pertama",
    title: "Pertemuan Pertama",
    content: `<p>Hari itu hujan turun lebih deras dari biasanya. Raya berdiri di bawah atap perpustakaan, menatap langit kelabu dengan perasaan campur aduk. Ujian akhir semester tinggal dua minggu lagi, dan ia belum menyentuh separuh materi.</p>
<p>"Sial," gumamnya pelan, menyadari payungnya tertinggal di kos.</p>
<p>Perpustakaan kampus hampir tutup. Penjaga sudah mulai mematikan lampu di beberapa bagian. Raya memeluk buku-bukunya lebih erat, berharap hujan segera reda.</p>
<p>"Mau nebeng payung?"</p>
<p>Suara itu datang dari sampingnya. Raya menoleh dan mendapati seorang laki-laki berdiri dengan payung hitam di tangan. Rambutnya sedikit basah, jaket denimnya memiliki noda air hujan. Tapi yang paling Raya ingat adalah matanya—hangat, seperti teh jahe di musim hujan.</p>
<p>"Aku Arga," katanya, setengah tersenyum. "Aku lihat kamu sering di perpustakaan. Teknik Sipil, kan?"</p>
<p>Raya mengangguk pelan. "Raya. Sastra Indonesia."</p>
<p>"Sastra? Pantas," Arga terkekeh. "Wajahmu kayak orang yang habis baca lima novel sehari."</p>
<p>Raya tidak tahu harus tersinggung atau tersanjung. Tapi sebelum ia sempat menjawab, Arga sudah membuka payungnya lebih lebar.</p>
<p>"Ayo. Aku antar ke halte."</p>
<p>Dan entah kenapa, Raya menurut.</p>
<p>Mereka berjalan berdua di bawah payung hitam, melewati genangan air dan daun-daun basah. Pembicaraan mengalir ringan—tentang dosen killer, kantin kampus, dan film-film yang tidak mereka tonton. Hujan masih turun, tapi Raya hampir lupa ia tidak membawa payung.</p>
<p>Saat sampai di halte, Arga menutup payungnya. "Sampai ketemu lagi, Raya Sastra Indonesia."</p>
<p>Raya tersenyum. "Sampai ketemu, Arga Teknik Sipil."</p>
<p>Bus datang. Raya naik dan duduk di dekat jendela. Dari kaca, ia melihat Arga masih berdiri di halte, mengeluarkan earphone dan memasangnya. Sebelum pandangan terhalang, Raya melihat lelaki itu tersenyum kecil.</p>
<p>Dan untuk pertama kalinya dalam semester itu, Raya pulang tanpa memikirkan ujian.</p>`,
    isPremium: false,
    price: 0,
    readCount: 1250,
  },
  {
    id: 2,
    workId: 1,
    workSlug: "senja-di-ujung-maret",
    chapterNumber: 2,
    slug: "hujan-dan-kopi",
    title: "Hujan dan Kopi",
    content: `<p>Seminggu setelah pertemuan di perpustakaan, Raya kembali bertemu Arga. Kali ini di kedai kopi dekat kampus.</p>
<p>Tempat itu bernama Kedai Rindu—namanya terlalu puitis untuk ukuran kedai kopi murah di pinggir jalan. Tapi kopinya enak, dan harganya cocok untuk kantong mahasiswa.</p>
<p>Raya sedang menulis esai tentang puisi Chairil Anwar ketika seseorang meletakkan cangkir di mejanya.</p>
<p>"Cappuccino. Katanya ini minuman favorit anak sastra."</p>
<p>Raya mendongak. Arga berdiri di samping mejanya, kali ini tanpa jaket denim. Hanya kaus hitam polos yang entah kenapa membuatnya terlihat lebih tinggi.</p>
<p>"Aku tidak bilang aku suka cappuccino," kata Raya.</p>
<p>"Tapi kamu tidak menolak juga, kan?"</p>
<p>Raya tidak menolak. Arga duduk di depannya dengan es kopi susu versinya sendiri.</p>
<p>"Jadi, esai tentang apa?" Arga melirik layar laptop Raya.</p>
<p>"Chairil Anwar. Aku sedang membahas puisinya yang paling terkenal."</p>
<p>"Aku. Itu judulnya kan? 'Aku ini binatang jalang'," Arga mendeklamasi dengan nada dramatis.</p>
<p>Raya tertawa. "Kamu hafal?"</p>
<p>"Hanya dua baris pertama. Selebihnya aku lupa. Teknik Sipil, ingat?"</p>
<p>Mereka ngobrol sampai sore. Tentang puisi, tentang jembatan (Arga bercerita tentang tugas besar merancang jembatan), tentang masa kecil, tentang mimpi-mimpi yang belum tercapai. Raya bercerita tentang keinginannya menjadi editor naskah, Arga bercerita tentang mimpinya membangun jembatan di desa terpencil.</p>
<p>Saat matahari mulai turun, Raya menyadari sesuatu: ia baru saja menghabiskan tiga jam tanpa menyentuh esainya.</p>
<p>"Aku harus pulang," katanya, meskipun setengah dari dirinya enggan beranjak.</p>
<p>Arga mengangguk. "Aku antar ke halte lagi?"</p>
<p>"Hari ini tidak hujan."</p>
<p>"Siapa bilang antar itu harus pakai payung?"</p>
<p>Mereka berjalan di bawah langit senja. Cahaya jingga menyelinap di antara pohon-pohon trembesi di sepanjang jalan. Raya berpikir: mungkin ini yang disebut sajak—saat dua orang berjalan bersama dan seluruh dunia terasa seperti bait puisi.</p>
<p>Di halte, Arga memberikan secarik kertas. "Nomerku. Kalau suatu saat kamu ingin diantar lagi. Hujan atau tidak."</p>
<p>Raya menggenggam kertas itu. Kertasnya sedikit lembab, mungkin dari gelas kopi yang dingin. Tapi nomor-nomor yang tertulis di atasnya terasa seperti kode rahasia menuju sesuatu yang belum ia pahami sepenuhnya.</p>
<p>Bus datang. Raya naik, duduk di dekat jendela. Kali ini, ia berbalik dan melambaikan tangan.</p>
<p>Arga membalas lambaiannya. Tersenyum. Dan di bawah langit Maret yang mulai gelap, Raya tahu: ini baru permulaan.</p>`,
    isPremium: false,
    price: 0,
    readCount: 980,
  },
  {
    id: 3,
    workId: 1,
    workSlug: "senja-di-ujung-maret",
    chapterNumber: 3,
    slug: "maret-belum-berakhir",
    title: "Maret Belum Berakhir",
    content: `<p>Minggu-minggu berikutnya berlalu seperti halaman buku yang dibalik terlalu cepat.</p>
<p>Raya dan Arga bertemu hampir setiap hari. Kadang di perpustakaan, kadang di Kedai Rindu, kadang di taman kampus yang mulai bersemi. Mereka berbagi playlist Spotify, saling merekomendasikan buku, dan menghabiskan malam-malam panjang lewat chat yang tidak pernah berakhir dengan "selamat tidur"—karena selalu ada satu topik lagi yang harus dibahas.</p>
<p>Tapi Raya mulai merasakan sesuatu. Sesuatu yang tidak bisa ia jelaskan dengan puisi Chairil Anwar atau novel-novel yang ia baca.</p>
<p>Jantungnya berdetak lebih cepat setiap kali nama Arga muncul di layar ponselnya. Tangannya sedikit gemetar setiap kali mereka duduk berdekatan. Dan matanya selalu mencari sosok tinggi dengan kaus hitam itu di setiap sudut kampus.</p>
<p>"Kamu kenapa?" tanya Siska, teman sekamarnya, suatu malam. "Kok senyum-senyum sendiri lihat hape?"</p>
<p>Raya buru-buru menyembunyikan layarnya. "Nggak kenapa-kenapa."</p>
<p>"Jangan bohong. Kamu lagi jatuh cinta, ya?"</p>
<p>Kata itu. Jatuh cinta. Raya tidak berani mengakuinya, bahkan pada dirinya sendiri.</p>
<p>Besoknya, Arga mengajaknya ke sebuah tempat yang belum pernah mereka kunjungi sebelumnya. Bukan perpustakaan, bukan kedai kopi. Tapi sebuah jembatan kecil di ujung kota, yang katanya ia temukan saat survey tugas kuliah.</p>
<p>"Ini tempat favoritku," kata Arga saat mereka sampai. "Aku datang ke sini kalau butuh mikir."</p>
<p>Jembatan itu terbuat dari kayu tua, melintang di atas sungai kecil yang airnya jernih. Di sekelilingnya, pohon-pohon besar meneduhkan. Dan saat senja turun, cahaya jingga menyelinap di antara dedaunan, menciptakan bayangan yang menari-nari di permukaan air.</p>
<p>"Indah banget," bisik Raya.</p>
<p>"Aku tahu kamu bakal suka."</p>
<p>Mereka duduk di tepi jembatan, kaki menggantung di atas air. Selama beberapa saat, tidak ada yang bicara. Hanya suara air dan burung-burung yang mulai pulang ke sarangnya.</p>
<p>"Raya," suara Arga tiba-tiba terdengar berbeda. Lebih pelan. Lebih serius.</p>
<p>"Ya?"</p>
<p>"Aku mau jujur sesuatu."</p>
<p>Raya menoleh. Wajah Arga setengah diterangi senja. Matanya—mata hangat seperti teh jahe itu—kini menatapnya dengan cara yang belum pernah ia lihat sebelumnya.</p>
<p>"Aku nggak sengaja datang ke perpustakaan hari itu," kata Arga pelan. "Aku sengaja. Aku udah lihat kamu dari jauh sebelumnya. Di kantin. Di koridor. Dan aku butuh alasan buat ngomong sama kamu."</p>
<p>Raya merasa napasnya tertahan.</p>
<p>"Hari itu, aku bawa payung padahal nggak hujan. Aku cuma nunggu kamu di perpustakaan. Dan aku lega banget waktu hujan turun dan kamu nggak bawa payung."</p>
<p>Raya tidak tahu harus berkata apa. Jantungnya berdebar terlalu kencang. Pikirannya berputar terlalu cepat.</p>
<p>"Aku..." Arga menunduk. "Aku suka sama kamu, Raya. Dari sebelum kita kenal."</p>
<p>Angin Maret berhembus pelan. Daun-daun berguguran. Dan di atas jembatan kayu itu, di bawah langit senja yang perlahan berubah menjadi ungu, Raya menyadari bahwa ia tidak perlu puisi untuk menjelaskan apa yang ia rasakan.</p>
<p>Ia hanya perlu satu kata.</p>
<p>"Aku juga."</p>
<p>Dan Maret belum berakhir.</p>`,
    isPremium: true,
    price: 5000,
    readCount: 650,
  },
  {
    id: 4,
    workId: 2,
    workSlug: "dua-detik-sebelum-kamu",
    chapterNumber: 1,
    slug: "kemampuan-yang-tidak-berguna",
    title: "Kemampuan yang Tidak Berguna",
    content: `<p>Aksara bisa melihat dua detik ke masa depan.</p>
<p>Selalu dua detik. Tidak lebih, tidak kurang. Kemampuan ini muncul pertama kali saat ia berumur delapan tahun, ketika ia "melihat" gelas susu yang akan tumpah dua detik sebelum benar-benar tumpah.</p>
<p>Saat itu ia pikir semua orang bisa melakukannya. Ternyata tidak.</p>
<p>Sekarang di umur dua puluh dua tahun, Aksara sudah terbiasa dengan kemampuannya. Ia menggunakannya untuk hal-hal kecil: menghindari percikan air dari motor yang lewat, menangkap barang sebelum jatuh, atau tahu kapan bosnya akan datang ke mejanya.</p>
<p>Tapi sejujurnya, kemampuan ini lebih sering merepotkan daripada membantu.</p>
<p>"Lo bisa lihat masa depan dua detik, tapi nggak bisa lihat soal UTS?" canda Dion, sahabatnya.</p>
<p>Aksara hanya tersenyum tipis. Ia sudah berhenti menjelaskan bahwa kemampuannya tidak bekerja seperti itu. Ia tidak bisa memilih apa yang dilihat. Kadang ia melihat hal penting, kadang hanya melihat orang yang akan menguap.</p>
<p>Hari itu, Aksara sedang duduk di halte bus, menunggu angkutan yang selalu datang terlambat. Di sampingnya, seorang gadis membaca buku dengan sampul yang tidak ia kenali.</p>
<p>Aksara melirik. Lalu, tanpa sengaja, ia "melihat."</p>
<p>Dua detik ke depan: gadis itu masih duduk, membaca bukunya. Sama seperti sekarang.</p>
<p>Tapi ada yang aneh.</p>
<p>Biasanya, penglihatannya selalu jelas. Selalu ada gambar, suara, atau sensasi. Tapi kali ini... kosong. Gadis itu ada, tapi di sekelilingnya hanyalah kehampaan putih. Seperti layar bioskop sebelum film dimulai.</p>
<p>Aksara mengerjap. Itu tidak pernah terjadi sebelumnya.</p>
<p>"Kamu kenapa?" suara gadis itu membuatnya tersadar.</p>
<p>Aksara baru sadar ia sudah menatap terlalu lama. "Eh, maaf. Aku cuma... bukunya menarik."</p>
<p>Gadis itu tersenyum. "Ini? Ini novel debut. Nggak terkenal sih."</p>
<p>"Judulnya apa?"</p>
<p>"Dua Detik Sebelum Kamu."</p>
<p>Darah Aksara berdesir. Judul itu... terlalu kebetulan.</p>
<p>"Aku Senja," kata gadis itu, mengulurkan tangan.</p>
<p>"Aksara."</p>
<p>Mereka bersalaman. Dan di saat tangan mereka bersentuhan, Aksara mencoba melihat lagi. Dua detik ke depan.</p>
<p>Lagi-lagi kosong. Bukan kosong seperti tidak terjadi apa-apa. Tapi kosong seperti... tidak ada masa depan.</p>
<p>Siapa gadis ini? Dan kenapa di masa depannya hanya ada kehampaan?</p>
<p>Bus datang. Senja menutup bukunya dan berdiri. "Kamu naik bus ini juga?"</p>
<p>Aksara mengangguk, meskipun sebenarnya ini bukan bus yang biasanya ia naiki.</p>
<p>Saat mereka duduk berdampingan di dalam bus, Aksara terus mencuri pandang. Setiap kali ia mencoba melihat masa depan Senja, yang ia dapatkan hanyalah putih. Selalu putih. Selalu kosong.</p>
<p>Dan untuk pertama kalinya dalam hidupnya, Aksara ingin tahu lebih banyak tentang seseorang yang masa depannya tidak bisa ia lihat.</p>`,
    isPremium: false,
    price: 0,
    readCount: 2100,
  },
  {
    id: 5,
    workId: 2,
    workSlug: "dua-detik-sebelum-kamu",
    chapterNumber: 2,
    slug: "kekosongan-yang-berbicara",
    title: "Kekosongan yang Berbicara",
    content: `<p>Aksara tidak bisa berhenti memikirkan gadis itu.</p>
<p>Senja. Nama yang indah. Terlalu indah untuk seseorang yang masa depannya kosong.</p>
<p>Setelah pertemuan di halte, Aksara mencari tahu tentang Senja. Ternyata mereka satu kampus. Senja adalah mahasiswi Desain Komunikasi Visual, tingkat akhir, dan terkenal sebagai ilustrator berbakat. Karya-karyanya sering dipamerkan di galeri kampus.</p>
<p>Tapi semakin Aksara mencari tahu, semakin ia tidak mengerti. Senja tampak seperti gadis normal dengan masa depan yang cerah. Lalu kenapa kemampuannya tidak bisa membaca masa depan gadis itu?</p>
<p>"Lo udah kayak stalker tau," kata Dion saat Aksara menceritakan obsesi barunya. "Kenapa nggak ngomong langsung aja?"</p>
<p>"Ngomong apa? 'Hai, aku bisa lihat masa depan dua detik dan masa depanmu kosong. Kamu alien ya?'"</p>
<p>Dion tertawa. "Ya jangan gitu juga kali."</p>
<p>Tapi takdir punya rencana sendiri. Seminggu kemudian, Aksara bertemu Senja lagi. Kali ini di perpustakaan—tempat yang jarang ia kunjungi.</p>
<p>"Kamu lagi?" Senja tersenyum saat melihatnya. "Jangan bilang kamu ngikutin aku."</p>
<p>Aksara gugup. "Nggak! Aku... lagi nyari buku."</p>
<p>"Buku apa?"</p>
<p>"Buku..." Aksara melirik rak terdekat. "Fisika kuantum."</p>
<p>Senja mengangkat alis. "Fisika kuantum? Kamu anak fisika?"</p>
<p>"Bukan. Aku anak teknik. Tapi aku suka... teori-teori aneh." Itu tidak sepenuhnya bohong.</p>
<p>Senja terkekeh. "Aneh banget. Tapi oke, siapa tau kita emang ditakdirkan ketemu terus."</p>
<p>Kata "ditakdirkan" membuat Aksara hampir tersedak ludah sendiri.</p>
<p>Mereka ngobrol lagi. Lebih lama kali ini. Aksara mengetahui bahwa Senja suka lukisan, benci hujan, dan punya kucing bernama Selasa. Senja juga bercerita tentang proyek akhirnya—sebuah novel grafis tentang gadis yang bisa melihat masa lalu.</p>
<p>"Kamu percaya nggak sama orang yang bisa lihat masa depan?" tanya Aksara hati-hati.</p>
<p>Senja menatapnya aneh. "Pertanyaan yang menarik."</p>
<p>"Serius, deh."</p>
<p>Senja berpikir sejenak. "Aku percaya ada hal-hal yang nggak bisa dijelaskan secara logika. Tapi kalau ada yang bilang dia bisa lihat masa depan... aku mungkin nggak percaya sampai aku lihat sendiri."</p>
<p>Aksara mengangguk pelan. Ada kelegaan sekaligus kekecewaan dalam jawaban itu.</p>
<p>Saat mereka berpisah di depan perpustakaan, matahari hampir tenggelam. Langit berwarna jingga—warna senja yang sempurna.</p>
<p>"Senja," panggil Aksara sebelum gadis itu pergi.</p>
<p>"Ya?"</p>
<p>Aksara ingin bertanya. Tentang kekosongan itu. Tentang masa depan yang tidak bisa ia lihat. Tapi ia tidak jadi.</p>
<p>"Hati-hati di jalan."</p>
<p>Senja tersenyum. "Kamu juga. Dan Aksara..."</p>
<p>"Ya?"</p>
<p>"Menurutku, kamu menyimpan rahasia. Dan aku penasaran."</p>
<p>Senja pergi, meninggalkan Aksara yang berdiri terpaku. Gadis itu tidak tahu betapa benarnya tebakannya.</p>`,
    isPremium: false,
    price: 0,
    readCount: 1780,
  },
  {
    id: 6,
    workId: 2,
    workSlug: "dua-detik-sebelum-kamu",
    chapterNumber: 3,
    slug: "pengakuan-di-atas-genteng",
    title: "Pengakuan di Atas Genteng",
    content: `<p>Sudah sebulan Aksara dan Senja berteman. Mereka sering bertemu—di kampus, di coffee shop, di pameran seni yang dihadiri Senja. Aksara mulai terbiasa dengan kehadiran gadis itu, meskipun misteri tentang masa depannya masih belum terpecahkan.</p>
<p>Suatu malam, Senja mengirim pesan.</p>
<p><em>"Besok malam. Atap gedung seni. Jam 7. Dateng ya. Ada yang mau aku tunjukin."</em></p>
<p>Aksara tidak bisa menolak. Ia tidak pernah bisa menolak Senja.</p>
<p>Malam berikutnya, ia mendapati Senja sudah duduk di atap gedung seni, dikelilingi sketsa-sketsa dan kaleng-kaleng cat semprot. Dari atap itu, mereka bisa melihat seluruh kampus. Lampu-lampu kota di kejauhan berkelap-kelip seperti bintang yang jatuh ke bumi.</p>
<p>"Aku suka tempat ini," kata Senja. "Di sini, semuanya terasa kecil. Masalah, ketakutan, semuanya."</p>
<p>Aksara duduk di sampingnya. "Kenapa kamu mau ketemu di sini?"</p>
<p>"Karena aku mau jujur." Senja menatapnya. "Aku tahu kamu menyimpan rahasia."</p>
<p>Aksara menegang. "Maksud kamu?"</p>
<p>"Aku perhatikan kamu, Aksara. Cara kamu menghindar sebelum sesuatu terjadi. Cara kamu tahu sesuatu sebelum hal itu terjadi. Kamu... berbeda."</p>
<p>Hening. Hanya suara angin malam yang mengisi jeda di antara mereka.</p>
<p>"Aku..." Aksara menarik napas panjang. Momen ini akan datang cepat atau lambat. "Aku bisa lihat masa depan. Dua detik. Selalu dua detik."</p>
<p>Senja tidak terkejut. Ia hanya mengangguk. "Aku tahu."</p>
<p>"Kamu tahu?"</p>
<p>"Aku menduga. Dan ada satu hal lagi yang aku tahu." Senja berhenti sejenak. "Aku tahu kenapa kamu nggak bisa lihat masa depanku."</p>
<p>Kali ini giliran Aksara yang terkejut. "Kamu... tahu tentang itu juga?"</p>
<p>"Aku tahu sejak pertama kali kita ketemu. Kamu menatapku dengan aneh. Seperti kamu melihat sesuatu yang seharusnya nggak ada."</p>
<p>Aksara tidak bisa berkata apa-apa.</p>
<p>"Aksara," suara Senja bergetar. "Aku nggak bisa lihat masa depan. Tapi aku bisa lihat masa lalu. Semua masa lalu. Setiap orang yang aku sentuh, aku bisa melihat seluruh kenangan mereka."</p>
<p>Dunia terasa berhenti.</p>
<p>"Makanya masa depanku kosong," bisik Aksara, akhirnya mengerti. "Karena kamu hidup di masa lalu."</p>
<p>"Dan kamu hidup di masa depan," lanjut Senja. "Kita saling melengkapi. Tapi tidak pernah benar-benar bertemu di waktu yang sama."</p>
<p>Aksara menatap gadis di depannya. Senja—gadis yang masa depannya selalu kosong. Kini ia tahu kenapa. Karena Senja tidak pernah benar-benar berada di masa depan. Ia selalu tertambat di masa lalu.</p>
<p>Dan Aksara—lelaki yang hanya bisa melihat dua detik ke depan. Ia tidak pernah benar-benar peduli dengan masa lalu.</p>
<p>"Terus sekarang gimana?" tanya Aksara.</p>
<p>Senja mengambil tangannya. "Sekarang... kita hidup di masa sekarang."</p>
<p>Saat tangan mereka bersentuhan, Aksara tidak mencoba melihat masa depan. Untuk pertama kalinya, ia hanya ingin merasakan detik ini. Detik di mana Senja menggenggam tangannya di atas atap gedung seni, di bawah langit yang penuh bintang.</p>
<p>"Aku suka kamu, Aksara," kata Senja. "Meskipun kamu cuma bisa lihat dua detik ke depan."</p>
<p>Aksara tersenyum. "Aku suka kamu, Senja. Meskipun masa depanmu selalu kosong."</p>
<p>Mereka tertawa bersama. Dua orang dengan kemampuan yang berlawanan, menemukan satu sama lain di malam yang sempurna.</p>
<p>"Dua detik," bisik Aksara. "Cukup buat bilang aku sayang kamu."</p>
<p>Dan di atas atap itu, di bawah bintang-bintang yang menjadi saksi, Aksara menyadari bahwa ia tidak perlu melihat masa depan. Karena masa depannya ada di sini, bersamanya, dalam genggaman tangan yang hangat.</p>
<p>Detik berganti detik. Malam berganti pagi. Dan dua orang yang tidak pernah benar-benar hidup di waktu yang sama, akhirnya menemukan cara untuk bertemu—di masa sekarang.</p>`,
    isPremium: true,
    price: 5000,
    readCount: 420,
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export function getChaptersByWorkSlug(workSlug: string): Chapter[] {
  return chapters
    .filter((c) => c.workSlug === workSlug)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export function getChapterBySlug(
  workSlug: string,
  chapterSlug: string
): Chapter | undefined {
  return chapters.find(
    (c) => c.workSlug === workSlug && c.slug === chapterSlug
  );
}

export function getAdjacentChapters(
  workSlug: string,
  currentSlug: string
): { prev: Chapter | null; next: Chapter | null } {
  const workChapters = getChaptersByWorkSlug(workSlug);
  const currentIndex = workChapters.findIndex((c) => c.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? workChapters[currentIndex - 1] : null,
    next:
      currentIndex < workChapters.length - 1
        ? workChapters[currentIndex + 1]
        : null,
  };
}

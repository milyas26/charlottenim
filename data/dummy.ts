import { Work, Chapter } from "./types";

export const works: Work[] = [
  {
    id: "1",
    title: "Senja di Ujung Maret",
    slug: "senja-di-ujung-maret",
    synopsis:
      "Raya tidak pernah menyangka pertemuannya dengan Arga di perpustakaan kampus akan mengubah seluruh hidupnya. Di antara halaman buku dan senja bulan Maret, mereka menemukan bahwa cinta kadang datang dari tempat yang paling tak terduga.",
    coverUrl: "https://picsum.photos/seed/senja/400/600",
    genres: ["Romance", "Slice of Life", "Campus"],
    status: "ONGOING",
    totalChapters: 3,
  },
  {
    id: "2",
    title: "Dua Detik Sebelum Kamu",
    slug: "dua-detik-sebelum-kamu",
    synopsis:
      "Aksara memiliki kemampuan unik: ia bisa melihat dua detik ke masa depan. Kemampuan yang menurutnya tidak berguna, sampai ia bertemu Senja—gadis yang masa depannya selalu kosong setiap kali Aksara mencoba melihat.",
    coverUrl: "https://picsum.photos/seed/duadetik/400/600",
    genres: ["Fantasy", "Romance", "Mystery"],
    status: "COMPLETED",
    totalChapters: 3,
  },
  {
    id: "3",
    title: "Hujan Terakhir di Bulan Juni",
    slug: "hujan-terakhir-di-bulan-juni",
    synopsis:
      "Setiap bulan Juni, hujan selalu mempertemukan Bara dan Hujan di halte bus yang sama. Namun Juni tahun ini berbeda—hujan tak kunjung turun, dan Bara harus memutuskan apakah ia akan menunggu lebih lama atau pergi sebelum halte itu menjadi kenangan.",
    coverUrl: "https://picsum.photos/seed/hujan/400/600",
    genres: ["Romance", "Drama", "Slice of Life"],
    status: "ONGOING",
    totalChapters: 3,
  },
  {
    id: "4",
    title: "Surat Kecil untuk Bintang",
    slug: "surat-kecil-untuk-bintang",
    synopsis:
      "Raka, seorang anak laki-laki berusia dua belas tahun, menulis surat untuk bintang setiap malam. Ia tidak pernah menyangka bahwa suatu hari, sebuah surat balasan akan jatuh dari langit—mengantarkannya pada petualangan yang akan mengubah cara ia melihat alam semesta.",
    coverUrl: "https://picsum.photos/seed/suratbintang/400/600",
    genres: ["Fantasy", "Coming of Age", "Adventure"],
    status: "ONGOING",
    totalChapters: 3,
  },
  {
    id: "5",
    title: "Antara Jakarta dan Kenangan",
    slug: "antara-jakarta-dan-kenangan",
    synopsis:
      "Setelah tujuh tahun merantau di Melbourne, Kania kembali ke Jakarta untuk menghadiri pemakaman ayahnya. Di tengah kota yang telah berubah, ia menemukan kembali potongan-potongan masa lalu—termasuk seseorang yang pernah ia tinggalkan tanpa pamit.",
    coverUrl: "https://picsum.photos/seed/jakarta/400/600",
    genres: ["Romance", "Family", "Drama"],
    status: "COMPLETED",
    totalChapters: 3,
  },
  {
    id: "6",
    title: "Pagi yang Tertukar",
    slug: "pagi-yang-tertukar",
    synopsis:
      "Ara dan Bima tidak sengaja menukar ponsel mereka di kedai kopi. Satu pagi yang kacau berubah menjadi rangkaian pertemuan tak terduga—pesan yang salah sasaran, panggilan tak dikenal, dan dua orang yang perlahan menemukan bahwa takdir kadang bekerja lewat kesalahan kecil.",
    coverUrl: "https://picsum.photos/seed/pagi-tertukar/400/600",
    genres: ["AU", "Romance", "Comedy"],
    status: "COMPLETED",
    totalChapters: 3,
  },
  {
    id: "7",
    title: "Stasiun Terakhir",
    slug: "stasiun-terakhir",
    synopsis:
      "Setiap malam pukul 23.47, Nara naik kereta terakhir dari Stasiun Kota. Di gerbong ke-3, ia selalu bertemu Revan—lelaki yang tak pernah turun sebelum stasiun terakhir. Dua orang asing yang berbagi perjalanan tanpa kata-kata, sampai suatu malam semuanya berubah.",
    coverUrl: "https://picsum.photos/seed/stasiun/400/600",
    genres: ["AU", "Drama", "Romance"],
    status: "ONGOING",
    totalChapters: 3,
  },
  {
    id: "8",
    title: "Kedai Hujan",
    slug: "kedai-hujan",
    synopsis:
      "Di sudut kota yang selalu basah, ada sebuah kedai kecil yang hanya buka saat hujan. Pemiliknya, Genta, menyajikan teh hangat untuk setiap jiwa yang butuh berteduh. Sampai suatu hari, seorang pelanggan datang bukan untuk berteduh dari hujan—tapi untuk mencari sesuatu yang telah lama hilang.",
    coverUrl: "https://picsum.photos/seed/kedaihujan/400/600",
    genres: ["AU", "Fantasy", "Slice of Life"],
    status: "ONGOING",
    totalChapters: 3,
  },
];

export const chapters: Chapter[] = [
  {
    id: "1",
    workId: "1",
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
    status: "PUBLISHED",
  },
  {
    id: "2",
    workId: "1",
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
    status: "PUBLISHED",
  },
  {
    id: "3",
    workId: "1",
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
    status: "PUBLISHED",
  },
  {
    id: "4",
    workId: "2",
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
    status: "PUBLISHED",
  },
  {
    id: "5",
    workId: "2",
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
    status: "PUBLISHED",
  },
  {
    id: "6",
    workId: "2",
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
    status: "PUBLISHED",
  },
  {
    id: "7",
    workId: "3",
    workSlug: "hujan-terakhir-di-bulan-juni",
    chapterNumber: 1,
    slug: "janji-hujan",
    title: "Janji Hujan",
    content: `<p>Halte bus di Jalan Cikini itu sunyi. Jam sudah menunjukkan pukul setengah enam sore, dan awan abu-abu mulai menggantung rendah di langit Jakarta. Bara menatap langit dengan perasaan familiar—ini bau hujan, dan bau hujan selalu mengingatkannya pada sesuatu yang tidak ingin ia ingat.</p>
<p>Atau seseorang.</p>
<p>"Kamu di sini lagi."</p>
<p>Suara itu. Bara tidak perlu menoleh untuk tahu siapa yang datang. Hanya satu orang yang selalu menemukan jalannya ke halte ini setiap kali langit mendung.</p>
<p>"Hujan," katanya, masih menatap lurus ke depan. "Kamu nggak pernah absen, ya."</p>
<p>Gadis itu—Hujan, nama yang terlalu pas untuk seseorang yang selalu muncul sebelum hujan turun—duduk di bangku di sampingnya. Rambutnya yang sedikit basah menandakan ia baru saja berlari kecil menghindari gerimis.</p>
<p>"Bilang aja kamu yang nungguin aku di sini," balas Hujan sambil menyengir.</p>
<p>Bara tidak menjawab. Tapi dalam hatinya, ia tahu Hujan benar. Setiap bulan Juni, selama tiga tahun terakhir, mereka selalu bertemu di halte ini. Awalnya kebetulan—dua orang asing yang terjebak hujan di tempat yang sama. Lalu kebetulan itu terjadi lagi. Dan lagi. Dan lagi. Sampai akhirnya mereka membuat janji tidak tertulis: setiap Juni, setiap hujan.</p>
<p>"Hari ini hujannya bakal deras," kata Hujan, mengeluarkan payung transparan dari tasnya. "Aku bawa payung. Kamu?"</p>
<p>Bara menunjuk ranselnya. "Selalu."</p>
<p>Hujan yang mereka tunggu akhirnya turun. Rintik demi rintik, lalu deras. Suara air menghantam atap halte menciptakan simfoni yang hanya bisa didengar di Jakarta—campuran hujan, klakson, dan bunyi kaki yang berlarian mencari tempat berteduh.</p>
<p>"Bara," suara Hujan tiba-tiba berubah serius. "Menurutmu, berapa lama kita bakal kayak gini?"</p>
<p>"Kayak gini gimana?"</p>
<p>"Ketemu di halte. Cuma pas hujan. Cuma pas Juni."</p>
<p>Bara menatapnya. Hujan sedang menggulung ujung jaketnya, tidak menatap balik. Tapi Bara bisa melihat ada sesuatu yang berbeda dari pertanyaan itu.</p>
<p>"Sampai hujannya berhenti," jawab Bara akhirnya.</p>
<p>Hujan tersenyum kecil. "Dan kalau hujannya nggak pernah turun lagi?"</p>
<p>"Kita bikin hujan sendiri."</p>
<p>Hujan akhirnya menoleh, alisnya terangkat. "Bikin hujan sendiri? Gimana caranya?"</p>
<p>Bara berdiri, mengambil payungnya, dan membukanya. "Dengan tidak menunggu." Ia mengulurkan tangan. "Ayo. Kita jalan. Hujannya udah reda."</p>
<p>Hujan menatap tangannya. Tangan yang selalu ada di sana, di halte ini, setiap kali ia membutuhkannya. Dan tanpa ragu, ia menyambutnya.</p>
<p>"Sampai Juni depan?" tanya Hujan saat mereka berjalan berdua di bawah payung Bara.</p>
<p>"Sampai Juni depan," Bara mengangguk.</p>
<p>Mereka tidak tahu bahwa Juni depan tidak akan sama. Bahwa hujan yang mereka tunggu-tunggu tidak akan pernah turun. Dan bahwa janji yang mereka buat di halte itu akan diuji dengan cara yang tidak pernah mereka bayangkan.</p>`,
    isPremium: false,
    price: 0,
    readCount: 890,
    status: "PUBLISHED",
  },
  {
    id: "8",
    workId: "3",
    workSlug: "hujan-terakhir-di-bulan-juni",
    chapterNumber: 2,
    slug: "juni-yang-kelabu",
    title: "Juni yang Kelabu",
    content: `<p>Juni datang lagi. Tapi hujan tidak.</p>
<p>Bara duduk di halte yang sama, menatap langit yang biru bersih. Tidak ada awan. Tidak ada mendung. Hanya matahari Jakarta yang menyengat dan angin panas yang menerbangkan debu jalanan.</p>
<p>Sudah seminggu bulan Juni berjalan, dan belum sekalipun ia melihat Hujan.</p>
<p>Mereka tidak pernah bertukar nomor telepon. Tidak pernah saling follow media sosial. Satu-satunya hal yang menghubungkan mereka adalah hujan dan bulan Juni. Tanpa hujan, tanpa Juni—mereka tidak punya apa-apa.</p>
<p>Bara tidak tahu kenapa ia terus datang ke halte ini setiap sore. Mungkin karena kebiasaan. Mungkin karena sesuatu yang lebih dari itu.</p>
<p>"Nunggu seseorang?"</p>
<p>Bara menoleh. Seorang bapak penjual koran yang biasa mangkal di dekat halte menatapnya dengan tatapan ingin tahu.</p>
<p>"Iya, Pak," jawab Bara singkat.</p>
<p>"Gadis yang biasanya sama kamu? Yang bawa payung transparan itu?"</p>
<p>Bara terkejut. Ternyata orang lain juga memperhatikan. "Bapak tahu?"</p>
<p>"Tahu, dong. Setiap Juni kalian selalu di sini. Kayak sinetron aja." Bapak itu terkekeh. "Tapi Juni ini kok kamu sendirian terus?"</p>
<p>Bara tidak menjawab. Karena ia sendiri tidak tahu jawabannya.</p>
<p>Hari berlalu. Bara tetap datang. Kadang ia membawa buku, kadang hanya duduk diam menatap jalanan. Beberapa kali gerimis turun, tapi hanya sebentar—tidak cukup untuk disebut hujan, tidak cukup untuk memanggil Hujan.</p>
<p>Di minggu ketiga, Bara mulai kehilangan harapan. Mungkin Hujan sudah pindah. Mungkin Hujan lupa. Mungkin hanya Bara yang menganggap janji di halte itu berarti.</p>
<p>Suatu sore, saat matahari mulai turun dan langit berubah jingga, Bara memutuskan ini adalah hari terakhirnya. Ia akan menunggu satu jam lagi, lalu pergi. Tidak akan kembali.</p>
<p>Tepat saat ia berdiri dan meraih ranselnya, seseorang duduk di sampingnya.</p>
<p>"Maaf aku telat."</p>
<p>Bara membeku. Suara itu. Ia menoleh perlahan—dan di sana, Hujan. Tapi ada yang berbeda. Matanya sembab. Pipinya lebih tirus. Dan payung transparan yang selalu dibawanya tidak ada di tangannya.</p>
<p>"Kamu..." suara Bara tercekat. "Kamu kenapa?"</p>
<p>"Ibuku sakit, Bara. Kanker. Sudah setahun. Bulan ini harus operasi besar. Makanya aku..." Suaranya pecah. "Makanya aku nggak bisa datang."</p>
<p>Hujan tidak datang bukan karena ia lupa. Bukan karena ia tidak ingin. Tapi karena ia sedang berjuang—sendirian, di rumah sakit, menjaga satu-satunya keluarga yang ia punya.</p>
<p>Bara duduk kembali. Kali ini lebih dekat. "Kenapa nggak bilang dari dulu?"</p>
<p>"Karena kita cuma ketemu pas hujan. Dan hujan nggak pernah cukup lama buat aku cerita."</p>
<p>Bara menatap langit. Biru. Cerah. Tidak ada tanda akan hujan. Tapi untuk pertama kalinya, ia sadar—mereka tidak butuh hujan.</p>
<p>"Cerita sekarang," katanya. "Aku di sini. Nggak perlu nunggu hujan."</p>
<p>Dan sore itu, di halte yang sama, tanpa setetes air pun dari langit, Hujan akhirnya bercerita. Tentang ibunya. Tentang rumah sakit. Tentang ketakutannya. Bara mendengarkan, tanpa menyela, tanpa menawarkan solusi—hanya mendengarkan.</p>
<p>Saat cerita selesai, langit sudah gelap. Bintang-bintang mulai bermunculan.</p>
<p>"Bara," bisik Hujan. "Kalau Juni ini hujannya nggak turun sama sekali... apakah kita tetap ketemu?"</p>
<p>Bara menatapnya. "Kita nggak butuh hujan, Hujan. Kita cuma butuh alasan buat terus datang."</p>
<p>Hujan tersenyum—senyum pertama yang Bara lihat sepanjang bulan Juni. "Aku suka alasan itu."</p>
<p>"Besok?" tanya Bara.</p>
<p>"Besok."</p>`,
    isPremium: false,
    price: 0,
    readCount: 720,
    status: "PUBLISHED",
  },
  {
    id: "9",
    workId: "3",
    workSlug: "hujan-terakhir-di-bulan-juni",
    chapterNumber: 3,
    slug: "hujan-tak-lagi-turun",
    title: "Hujan Tak Lagi Turun",
    content: `<p>Operasi berlangsung delapan jam. Bara menunggu di lorong rumah sakit bersama Hujan, yang sejak tadi pagi tidak berhenti menggigit bibirnya.</p>
<p>Akhir Juni. Tidak ada hujan sepanjang bulan ini. Tapi untuk pertama kalinya, tidak ada yang peduli.</p>
<p>"Dokternya bilang kemungkinan berhasilnya tujuh puluh persen," kata Hujan, lebih ke dirinya sendiri daripada ke Bara. "Tujuh puluh persen itu banyak, kan?"</p>
<p>"Banyak," Bara menegaskan. "Ibumu kuat. Kayak anaknya."</p>
<p>Hujan menatapnya. "Dari mana kamu tahu aku kuat?"</p>
<p>"Karena kamu datang ke halte itu sendirian. Setiap Juni. Selama tiga tahun. Sambil bawa beban seberat ini." Bara menunjuk dadanya sendiri. "Itu definisi kuat."</p>
<p>Air mata yang sejak tadi ditahan Hujan akhirnya jatuh. Bukan karena sedih—tapi karena seseorang akhirnya melihat. Seseorang akhirnya tahu.</p>
<p>Pukul empat sore, dokter keluar dari ruang operasi. Wajahnya lelah tapi tersenyum kecil. "Operasinya berhasil. Ibunya harus istirahat total beberapa minggu, tapi semuanya berjalan lancar."</p>
<p>Hujan memeluk Bara. Erat. Lama. Bara membalas pelukan itu, merasakan gemetar yang perlahan mereda.</p>
<p>"Terima kasih," bisik Hujan di bahunya. "Buat semuanya."</p>
<p>Mereka menunggu sampai ibu Hujan dipindahkan ke ruang rawat inap. Saat akhirnya diizinkan masuk, Hujan menggenggam tangan ibunya—wanita paruh baya dengan wajah yang sangat mirip dengan putrinya.</p>
<p>"Mama," panggil Hujan pelan. "Ini Bara. Temenku."</p>
<p>Ibunya membuka mata, menatap Bara dengan lemah. "Bara... yang suka nungguin Hujan di halte?"</p>
<p>Bara tersenyum. "Iya, Tante."</p>
<p>"Makasih ya... udah jagain Hujan."</p>
<p>Hujan menoleh, kaget. "Mama tahu?"</p>
<p>"Kamu cerita tiap pulang," bisik ibunya. "Soal cowok di halte yang selalu ada. Yang selalu bawa payung."</p>
<p>Hujan tersipu. Bara merasakan sesuatu yang hangat menjalar di dadanya.</p>
<p>Malam itu, setelah memastikan ibu Hujan tertidur, mereka berdua duduk di taman rumah sakit. Langit di atas mereka gelap, tapi penuh bintang.</p>
<p>"Juni hampir habis," kata Hujan. "Dan nggak hujan sama sekali."</p>
<p>"Iya."</p>
<p>"Tapi kamu tetap di sini."</p>
<p>Bara menoleh. "Aku udah bilang. Kita nggak butuh hujan."</p>
<p>Hujan menatapnya lama. Lalu, tanpa aba-aba, ia menyandarkan kepalanya di bahu Bara. "Kalau gitu... sampai Juli? Sampai Agustus? Sampai seterusnya?"</p>
<p>Bara merasakan jantungnya berdetak lebih cepat. "Sampai seterusnya."</p>
<p>Mereka duduk seperti itu—dua orang yang selama ini hanya bertemu di bawah hujan, kini belajar bertemu di bawah bintang. Juni berlalu. Juli datang. Agustus menyusul. Hujan turun dan berhenti, turun dan berhenti. Tapi mereka tidak lagi menunggu.</p>
<p>Karena ternyata, halte itu hanya alasan. Hujan hanya alasan. Juni hanya alasan. Yang sebenarnya adalah dua orang yang saling menemukan di antara kebetulan-kebetulan, dan memilih untuk tidak lagi bergantung pada hujan.</p>
<p>Dan di suatu sore di bulan September—saat hujan akhirnya turun dengan deras—Bara dan Hujan berdiri di halte yang sama. Bukan karena menunggu. Tapi karena mereka ingin. Sama seperti semua sore lainnya.</p>
<p>Hanya saja kali ini, Hujan membawa sesuatu di tangannya. Sebuah kotak kecil.</p>
<p>"Bara," katanya. "Aku udah nggak butuh hujan lagi."</p>
<p>Bara menatap kotak itu. "Itu...?"</p>
<p>"Kunci rumah. Ibuku udah sembuh. Kita pindah ke rumah baru. Dan..." Hujan tersenyum. "Aku mau kamu jadi bagian dari rumah itu."</p>
<p>Hujan—gadis yang muncul setiap kali langit menangis—kini memberikan kunci kepada seseorang yang selama ini menjadi payungnya. Dan Bara, yang selama ini menunggu hujan, menyadari bahwa ia selama ini menunggu hal yang salah.</p>
<p>Ia menunggu hujan. Padahal yang ia butuhkan adalah Hujan.</p>`,
    isPremium: true,
    price: 5000,
    readCount: 310,
    status: "PUBLISHED",
  },
  {
    id: "10",
    workId: "4",
    workSlug: "surat-kecil-untuk-bintang",
    chapterNumber: 1,
    slug: "pengirim-surat-misterius",
    title: "Pengirim Surat Misterius",
    content: `<p>Raka menulis surat pertamanya pada malam ulang tahunnya yang kedua belas.</p>
<p>Ia duduk di balkon kamarnya, ditemani cahaya bulan dan selembar kertas yang disobek dari buku tulisnya. Di atas meja kecil, sebuah lilin menyala—satu-satunya sumber penerangan, karena Raka tidak ingin Ayah tahu ia belum tidur.</p>
<p>"Untuk Bintang," tulisnya dengan pensil yang sudah pendek. "Aku tidak tahu apakah kamu bisa membaca ini. Tapi semalam aku melihatmu jatuh, dan aku berharap kamu tidak terluka."</p>
<p>Raka melipat kertas itu menjadi bentuk pesawat, lalu melemparkannya ke langit. Pesawat kertas itu melayang sejenak, tertiup angin malam, lalu menghilang di kegelapan.</p>
<p>Ia tidak menyangka akan mendapat balasan.</p>
<p>Esok paginya, Raka menemukan selembar kertas tergeletak di balkon. Bukan kertasnya—ini kertas lain. Lebih halus. Lebih putih. Dan berbau seperti rumput setelah hujan.</p>
<p>Dengan tangan gemetar, ia membukanya.</p>
<p><em>"Halo, Raka. Aku membaca suratmu. Aku tidak terluka. Tapi aku kesepian. Terima kasih sudah menulis surat. —Seraphina."</em></p>
<p>Raka membaca surat itu berulang-ulang. Matanya membelalak. Jantungnya berdebar kencang. Nama pengirimnya bukan "Bintang", tapi "Seraphina."</p>
<p>"Seraphina..." bisiknya. Nama itu terdengar seperti dari cerita dongeng. "Kamu... bintang?"</p>
<p>Tentu tidak ada yang menjawab.</p>
<p>Malam itu, Raka menulis surat lagi. Kali ini lebih panjang. Ia bercerita tentang dirinya—anak tunggal yang tinggal di kota kecil bersama Ayah, yang sejak Ibu meninggal menjadi pendiam dan jarang tersenyum. Ia bercerita tentang sekolahnya, tentang temannya yang hanya satu, tentang malam-malam panjang yang ia habiskan sendirian di balkon dengan teleskop pemberian Ibu.</p>
<p>Paginya, balasan sudah menunggu.</p>
<p><em>"Raka, aku juga kesepian. Di sini gelap dan dingin. Ceritakan lebih banyak tentang duniamu. Tentang hujan. Tentang pelangi. Tentang apa pun. Aku ingin tahu. —Seraphina."</em></p>
<p>Dan begitulah surat-menyurat itu dimulai.</p>
<p>Setiap malam Raka menulis surat. Setiap pagi Seraphina membalasnya. Surat-surat itu menjadi jendela Raka ke dunia yang belum pernah ia bayangkan. Seraphina bercerita tentang kosmos—tentang nebula yang berwarna-warni, tentang black hole yang menelan cahaya, tentang komet-komet yang melintas membawa harapan.</p>
<p>Tapi Seraphina juga bercerita tentang kesendiriannya. Tentang bagaimana ia adalah satu-satunya bintang yang memiliki kesadaran di galaksinya. Tentang bagaimana ia telah mengembara selama ribuan tahun, mengirimkan sinyal yang tidak pernah dijawab.</p>
<p>"Kamu satu-satunya yang membalas," tulisnya suatu pagi. "Satu-satunya manusia yang melihatku bukan hanya sebagai titik cahaya."</p>
<p>Raka menangis membaca surat itu.</p>
<p>Karena ia tahu persis bagaimana rasanya. Ia juga sendirian. Ia juga tidak dilihat. Dan kini, dua makhluk dari dua dunia yang berbeda menemukan satu sama lain—melalui selembar kertas dan seberkas cahaya.</p>
<p>Namun Raka belum tahu bahwa surat-surat ini hanyalah permulaan. Bahwa segera, ia harus melakukan perjalanan yang tidak pernah ia bayangkan—ke utara, ke tempat bintang-bintang bersemayam, ke tempat di mana Seraphina menunggunya. Dan bahwa perjalanan itu akan mengubah segalanya.</p>
<p>Bukan hanya untuk Raka. Tapi juga untuk Ayahnya. Untuk dunianya. Untuk seluruh alam semesta yang selama ini diam-diam memperhatikan.</p>`,
    isPremium: false,
    price: 0,
    readCount: 1560,
    status: "PUBLISHED",
  },
  {
    id: "11",
    workId: "4",
    workSlug: "surat-kecil-untuk-bintang",
    chapterNumber: 2,
    slug: "balasan-dari-langit",
    title: "Balasan dari Langit",
    content: `<p>Sudah tiga bulan Raka dan Seraphina saling berkirim surat. Setiap malam, Raka menulis dengan pensilnya yang semakin pendek. Setiap pagi, Seraphina membalas dengan kertas yang berbau rumput setelah hujan.</p>
<p>Tapi pagi ini berbeda.</p>
<p>Raka bangun dan menemukan bukan hanya surat di balkonnya. Ada sesuatu yang lain—sebuah batu kecil, sebesar kelereng, yang berpendar dengan cahaya biru lembut. Saat ia menyentuhnya, batu itu hangat. Seperti baru saja jatuh dari langit.</p>
<p>Ia membaca surat Seraphina dengan perasaan tidak tenang:</p>
<p><em>"Raka, aku dalam bahaya. Ada sesuatu di galaksiku. Sesuatu yang gelap dan lapar. Ia memakan bintang-bintang. Sudah banyak temanku yang hilang. Aku tidak tahu berapa lama lagi aku bisa mengirim surat. Kalau kamu bisa mendengar ini—datanglah. Aku butuh bantuanmu. Aku mengirimkan Starlight—batu yang bisa membawamu ke sini. Pegang erat. Pikirkan aku. Dan kamu akan tiba.</em></p>
<p><em>Aku tahu ini banyak yang kuminta. Kamu baru dua belas tahun. Kamu hanya seorang anak manusia. Tapi kamu adalah satu-satunya temanku. Satu-satunya yang pernah membalas suratku.</em></p>
<p><em>Tolong, Raka. —Seraphina."</em></p>
<p>Raka membaca surat itu tiga kali. Tangannya gemetar. Pikirannya berputar. Seekor bintang—sebuah bola gas raksasa di luar angkasa—meminta bantuan kepada seorang anak laki-laki berusia dua belas tahun dari Indonesia.</p>
<p>Ini gila.</p>
<p>Tapi surat-surat itu nyata. Batu di tangannya—Starlight—nyata. Hangatnya nyata. Cahayanya nyata. Dan persahabatan yang telah mereka bangun selama tiga bulan... itu juga nyata.</p>
<p>Raka melihat ke dalam rumah. Ayahnya sedang tidur di sofa, seperti biasa. Botol-botol kosong bertebaran di meja. Sejak Ibu meninggal, Ayah hanya hidup dalam rutinitas: kerja, pulang, minum, tidur. Mereka hampir tidak pernah bicara.</p>
<p>"Ayah nggak akan sadar aku pergi," bisik Raka pada dirinya sendiri.</p>
<p>Ia menulis surat singkat untuk Ayahnya, menjelaskan bahwa ia pergi untuk menolong seorang teman. Lalu ia kembali ke balkon, menggenggam Starlight di tangan kanannya, dan menutup mata.</p>
<p>"Seraphina," panggilnya dalam hati. "Aku datang."</p>
<p>Cahaya biru membungkus tubuhnya. Angin berputar di sekelilingnya. Dan dalam sekejap, balkon rumahnya lenyap.</p>
<p>—</p>
<p>Raka membuka mata di tempat yang tidak mirip dengan apa pun yang pernah ia bayangkan.</p>
<p>Langit di atasnya bukan biru, tapi ungu tua dengan guratan-guratan emas yang bergerak perlahan. Di kejauhan, ia melihat planet-planet dengan cincin-cincin raksasa, bulan-bulan yang bercahaya, dan awan-awan gas berwarna pink dan biru elektrik. Bintang-bintang tidak seperti titik di langit malam—mereka seperti bola-bola cahaya yang menggantung. Beberapa sebesar kepalan tangan, beberapa sebesar rumah.</p>
<p>"Raka."</p>
<p>Suara itu datang dari atas. Raka mendongak—dan melihatnya.</p>
<p>Sesosok cahaya. Bukan bola, bukan titik. Tapi bentuk yang menyerupai manusia, terbuat dari cahaya putih keemasan yang berdenyut pelan. Di bagian tengahnya, ada inti yang lebih terang—seperti jantung yang berdetak.</p>
<p>"Seraphina?" bisik Raka.</p>
<p>Cahaya itu turun, mendekat, dan untuk pertama kalinya Raka bisa melihat bahwa ia memiliki mata. Dua titik biru yang hangat, yang menatapnya dengan penuh rasa syukur.</p>
<p>"Kamu datang," kata Seraphina. Suaranya seperti nada piano yang paling tinggi—jernih dan bergetar. "Aku tidak percaya. Kamu benar-benar datang."</p>
<p>Raka tidak tahu harus berkata apa. Ia berdiri di sebuah dunia asing, di hadapan makhluk yang tidak bisa ia jelaskan, dan satu-satunya hal yang ia rasakan adalah... lega. Lega karena ia tidak lagi sendirian.</p>
<p>"Aku Raka," katanya akhirnya. "Dan aku di sini buat nolongin kamu."</p>
<p>Seraphina mengeluarkan suara yang mungkin adalah tawa. "Kamu pemberani sekali, manusia kecil."</p>
<p>"Aku nggak kecil," protes Raka. "Aku udah dua belas."</p>
<p>"Di galaksiku, dua belas tahun itu baru sekejap mata."</p>
<p>Raka tidak tahu harus bangga atau tersinggung. Tapi sebelum ia bisa memikirkan lebih jauh, sesuatu bergerak di kejauhan. Sesuatu yang besar. Sesuatu yang hitam. Sesuatu yang membuat semua bintang di sekitarnya meredup.</p>
<p>"Itu dia," bisik Seraphina, suaranya berubah ketakutan. "Si Pemakan Bintang."</p>
<p>Raka menelan ludah. Genggamannya pada Starlight semakin erat.</p>
<p>Petualangan yang sesungguhnya baru saja dimulai.</p>`,
    isPremium: false,
    price: 0,
    readCount: 1340,
    status: "PUBLISHED",
  },
  {
    id: "12",
    workId: "4",
    workSlug: "surat-kecil-untuk-bintang",
    chapterNumber: 3,
    slug: "perjalanan-ke-utara",
    title: "Perjalanan ke Utara",
    content: `<p>Si Pemakan Bintang bukanlah monster seperti di film-film. Ia tidak memiliki taring atau cakar atau rahang raksasa. Ia adalah kegelapan itu sendiri—hitam yang lebih hitam dari malam, sunyi yang lebih sunyi dari keheningan. Ia bergerak perlahan melintasi galaksi, dan setiap bintang yang disentuhnya padam dalam sekejap.</p>
<p>"Kenapa dia melakukan ini?" tanya Raka, bersembunyi di balik batu besar bersama Seraphina.</p>
<p>"Dia bukan jahat, Raka. Dia hanya... lapar. Dia makhluk dari dimensi lain yang tersesat di sini. Dia memakan cahaya karena itulah satu-satunya yang bisa dia konsumsi. Dia tidak tahu kalau bintang-bintang itu hidup."</p>
<p>Raka menatap kegelapan yang merayap mendekat. "Terus gimana caranya nghentiin dia?"</p>
<p>"Kita nggak bisa menghentikannya. Tapi kita bisa mengirimnya pulang."</p>
<p>"Gimana?"</p>
<p>Seraphina mengeluarkan sesuatu dari intinya—sebuah gulungan yang terbuat dari cahaya. Saat dibuka, Raka melihat itu adalah peta. Sebuah peta galaksi, dengan satu titik yang berkelap-kelip di bagian utara.</p>
<p>"Di utara galaksi, ada Gerbang Dimensi. Tempat di mana semua alam semesta bertemu. Kalau kita bisa membawanya ke sana, dia bisa pulang ke rumahnya."</p>
<p>Raka memandang peta itu. "Tapi gimana caranya?"</p>
<p>"Dia tertarik pada cahaya. Aku akan menjadi umpannya. Kamu yang akan memandu jalannya."</p>
<p>"Aku?!" Raka hampir berteriak. "Aku nggak bisa! Aku cuma anak kecil!"</p>
<p>"Raka." Seraphina menatapnya dengan mata biru yang dalam. "Kamu bukan sekadar anak kecil. Kamu adalah satu-satunya manusia yang pernah membalas surat dari bintang. Kamu adalah satu-satunya temanku. Dan aku percaya kamu."</p>
<p>Kata-kata itu menancap di dada Raka.</p>
<p>Selama ini, ia merasa tidak berguna. Tidak dibutuhkan. Hanya anak yang ditinggal di rumah, yang tidak pernah dilihat Ayahnya. Tapi kini—di tengah galaksi yang asing, di hadapan kegelapan yang menelan segalanya—seseorang mempercayainya.</p>
<p>"Baiklah," katanya, suaranya bergetar tapi pasti. "Aku akan lakukan."</p>
<p>Rencana mereka dimulai. Seraphina terbang ke angkasa, cahayanya diperbesar hingga bersinar seperti supernova kecil. Si Pemakan Bintang menoleh. Tertarik. Mulai bergerak ke arahnya.</p>
<p>Sementara itu, Raka berdiri di atas planet kecil yang menjadi tempat persembunyian mereka, menggenggam Starlight erat-erat. "Arahkan ke Utara," bisiknya pada dirinya sendiri. "Ke Utara. Ke Utara."</p>
<p>Starlight memancarkan sinar biru yang menunjuk ke arah tertentu. Raka mengikuti arah itu, sementara Seraphina terbang di depannya, menjaga jarak aman dari Si Pemakan Bintang.</p>
<p>Perjalanan itu terasa seperti seumur hidup. Raka melewati asteroid, nebula, planet-planet mati yang permukaannya penuh kawah. Ia berlari di atas jembatan gas, melompati celah-celah dimensi, mengikuti cahaya Starlight yang tidak pernah padam.</p>
<p>Dan di belakang, Si Pemakan Bintang terus mengikuti—menelan bintang demi bintang yang ada di jalurnya.</p>
<p>"Seraphina! Kita hampir sampai!" teriak Raka, melihat Gerbang Dimensi di kejauhan. Sebuah cincin raksasa yang berputar, terbuat dari cahaya yang warnanya terus berubah—merah, biru, hijau, emas.</p>
<p>Tapi saat itulah bencana terjadi. Si Pemakan Bintang tiba-tiba mengubah arah—bukan lagi mengejar Seraphina, tapi langsung menuju Gerbang Dimensi. Kecepatannya meningkat. Ia seperti tertarik oleh sesuatu.</p>
<p>"Dia mencoba masuk sendiri!" teriak Seraphina. "Tapi kalau dia masuk tanpa dipandu, gerbangnya akan runtuh! Semua dimensi akan tercampur!"</p>
<p>Raka berpikir cepat. Ia melihat sesuatu—sebuah ledakan kecil di dekatnya, sisa dari komet yang meledak. Energi. Cahaya. Sesuatu yang bisa mengalihkan perhatian Si Pemakan Bintang.</p>
<p>"Seraphina!" teriaknya. "Aku butuh cahayamu! Semuanya!"</p>
<p>"Tapi kalau aku kasih semua, aku bisa padam!"</p>
<p>"Percaya sama aku!"</p>
<p>Seraphina ragu. Tapi hanya sekejap. Lalu ia melepaskan seluruh cahayanya—sebuah ledakan sinar yang begitu terang hingga seluruh galaksi seolah berhenti. Si Pemakan Bintang berbalik, tertarik oleh cahaya yang bahkan lebih besar dari Seraphina sendiri.</p>
<p>Sementara itu, Raka berlari ke arah Gerbang Dimensi. "Ayo! Ke sini!" teriaknya pada Si Pemakan Bintang, mengarahkan Starlight tepat ke pusat gerbang.</p>
<p>Si Pemakan Bintang mengejarnya. Kegelapannya semakin dekat. Raka bisa merasakan dingin yang menjalari tulang-tulangnya. Tapi ia terus berlari. Berlari sampai kakinya terasa terbakar, sampai napasnya sesak, sampai—</p>
<p>—ia melemparkan Starlight ke dalam gerbang.</p>
<p>Si Pemakan Bintang melesat masuk, mengikuti cahaya biru itu. Gerbang bergetar hebat. Warna-warna berputar kencang. Dan kemudian—</p>
<p>Hening.</p>
<p>Gerbang menutup. Si Pemakan Bintang hilang. Bintang-bintang yang sempat padam mulai menyala kembali, satu per satu. Galaksi kembali terang.</p>
<p>Raka tersungkur. Napasnya tersengal-sengal. Tapi ia tersenyum. "Kita berhasil."</p>
<p>Seraphina turun ke sampingnya. Cahayanya redup, hampir habis. Tapi ia masih hidup. Masih bernyala.</p>
<p>"Kamu benar-benar melakukannya, Raka."</p>
<p>"Kita yang melakukannya." Raka menatapnya. "Kamu baik-baik aja?"</p>
<p>"Aku akan pulih. Butuh waktu, tapi aku akan pulih." Seraphina mengeluarkan sesuatu dari intinya—sebuah batu kecil, seperti Starlight, tapi kali ini bercahaya emas. "Ini buat kamu. Supaya kamu bisa pulang. Dan supaya kamu bisa kembali lagi kapan pun kamu mau."</p>
<p>Raka menerima batu itu. Hangat. Seperti pelukan ibunya. "Aku pasti akan kembali."</p>
<p>"Aku tahu."</p>
<p>Cahaya emas membungkus Raka. Dan saat ia memejamkan mata, ia mendengar suara Seraphina—lembut, seperti nada piano yang paling tinggi:</p>
<p>"Sampai jumpa, sahabat kecilku."</p>
<p>—</p>
<p>Raka membuka mata. Ia kembali di balkon rumahnya. Matahari pagi baru saja terbit. Di tangannya, sebuah batu kecil bercahaya emas.</p>
<p>Dan di mejanya, selembar kertas berbau rumput setelah hujan:</p>
<p><em>"Galaksi sedang berterima kasih padamu. —Seraphina."</em></p>
<p>Raka masuk ke dalam rumah. Ayahnya masih tidur di sofa. Tapi kali ini, alih-alih menghindar, Raka duduk di sampingnya. Menyentuh bahunya pelan.</p>
<p>"Ayah," bisiknya. "Aku harus cerita sesuatu."</p>`,
    isPremium: true,
    price: 5000,
    readCount: 680,
    status: "PUBLISHED",
  },
  {
    id: "13",
    workId: "5",
    workSlug: "antara-jakarta-dan-kenangan",
    chapterNumber: 1,
    slug: "kepulangan",
    title: "Kepulangan",
    content: `<p>Pesawat mendarat di Bandara Soekarno-Hatta pukul tujuh pagi. Kania menatap jendela yang mulai basah oleh hujan pagi—Jakarta menyambutnya dengan cara yang sama seperti saat ia pergi, tujuh tahun lalu.</p>
<p>Hanya saja, kali ini ia tidak akan kembali ke Melbourne. Tidak akan kembali ke apartemen kecilnya di Carlton, tidak akan kembali ke kafenya di Lygon Street, tidak akan kembali ke kehidupan yang susah payah ia bangun dari nol.</p>
<p>Karena Ayah sudah tiada.</p>
<p>SMS dari adiknya, Rendra, datang dua hari lalu. Singkat, seperti kebanyakan komunikasi mereka: "Ayah meninggal tadi malam. Serangan jantung. Pemakaman hari Kamis. Pulang."</p>
<p>Kania membaca pesan itu berulang kali di dapur apartemennya, secangkir kopi dingin di tangan, mencoba mencerna kenyataan bahwa ia tidak akan pernah bisa meminta maaf pada Ayahnya. Tidak akan pernah bisa menjelaskan kenapa ia pergi. Tidak akan pernah bisa mengucapkan selamat tinggal.</p>
<p>Di bandara, ia melihat Rendra berdiri di antara kerumunan penjemput. Adiknya itu sudah dua puluh delapan tahun sekarang, jauh berbeda dari bocah lima belas tahun yang ia tinggalkan. Kumis tipis. Bahu lebih lebar. Tapi tatapan matanya sama—dingin dan penuh tanya.</p>
<p>"Mbak." Bukan sambutan hangat. Hanya pernyataan. Kamu di sini.</p>
<p>"Ren." Kania ingin memeluknya, tapi tubuh Rendra kaku. "Maaf aku..."</p>
<p>"Udah. Nggak usah. Mobil di parkiran."</p>
<p>Mereka berkendara dalam diam. Jakarta yang dulu Kania kenal sudah banyak berubah. Ada mal baru di mana dulu ada pasar tradisional. Ada apartemen menjulang di mana dulu ada rumah-rumah kecil. Ada jalan layang yang tidak ia kenali. Tapi panasnya masih sama. Macetnya masih sama. Dan perasaan sesak di dadanya juga masih sama.</p>
<p>Rumah duka berada di kawasan Matraman—rumah lama yang sama dengan dinding cat hijau yang sudah mengelupas. Di halaman depannya, tenda biru sudah berdiri. Kursi-kursi plastik tersusun rapi. Bunga-bunga duka cita berjejer.</p>
<p>Kania masuk dan langsung melihat foto Ayah di dekat peti. Foto hitam putih, diambil entah kapan—Ayah masih muda di foto itu, masih dengan senyum yang Kania ingat sebelum semuanya berubah.</p>
<p>"Kania!"</p>
<p>Suara itu milik Tante Mira, adik ibunya yang telah menggantikan peran ibu sejak Ibu meninggal saat Kania berumur sepuluh tahun. Wanita itu menghampiri dan memeluknya erat. Wangi bedak dan masakan rumah.</p>
<p>"Akhirnya kamu pulang. Tante kangen. Ayah kamu juga... Ayah selalu nanya tentang kamu."</p>
<p>Kania menahan tangis. "Ayah... sering nanya saya?"</p>
<p>"Setiap hari, Nia. Setiap hari dia nunggu telepon dari kamu. Sampai akhir."</p>
<p>Kania merasa kakinya lemas. Ia duduk di kursi terdekat, menatap foto Ayahnya, dan untuk pertama kalinya dalam tujuh tahun, ia menangis. Bukan tangis histeris. Hanya air mata yang mengalir tanpa suara, mengingat semua kata-kata yang tidak pernah sempat ia ucapkan.</p>
<p>"Saya pergi karena saya marah, Yah," bisiknya pada foto itu. "Bukan karena saya nggak sayang."</p>
<p>Tapi Ayah tidak akan pernah mendengarnya lagi.</p>
<p>Di sudut ruangan, seseorang memperhatikannya. Seorang laki-laki dengan kemeja putih dan wajah yang tidak asing—tapi tidak bisa langsung Kania kenali. Ia berdiri agak jauh, seolah tidak yakin apakah ia boleh mendekat.</p>
<p>Lalu laki-laki itu melangkah maju. "Kania?"</p>
<p>Kania mendongak. Dan saat mata mereka bertemu, ingatan itu kembali—seperti gelombang yang menghantam tanpa peringatan.</p>
<p>Laki-laki itu adalah Arman. Sahabat masa kecilnya. Orang yang tepat tujuh tahun lalu ia tinggalkan tanpa sepatah kata pun.</p>`,
    isPremium: false,
    price: 0,
    readCount: 970,
    status: "PUBLISHED",
  },
  {
    id: "14",
    workId: "5",
    workSlug: "antara-jakarta-dan-kenangan",
    chapterNumber: 2,
    slug: "jejak-yang-tertinggal",
    title: "Jejak yang Tertinggal",
    content: `<p>"Arman."</p>
<p>Nama itu keluar dari mulut Kania seperti sebuah pengakuan. Sebuah kata yang terlalu lama ia pendam.</p>
<p>Arman berdiri di hadapannya, tangannya dimasukkan ke saku celana—kebiasaan lamanya. Wajahnya lebih dewasa sekarang, dengan rahang yang lebih tegas dan garis-garis halus di sekitar mata. Tapi caranya menatap Kania masih sama: campuran antara ingin tahu dan kehati-hatian.</p>
<p>"Kamu pulang," katanya. Bukan pertanyaan. Pernyataan.</p>
<p>"Cuma buat pemakaman."</p>
<p>"Oh." Hening. Lalu: "Ikut berduka cita. Om Herman orang baik."</p>
<p>Kania hanya mengangguk. Suasana di antara mereka begitu canggung hingga udara terasa lebih berat. Tujuh tahun. Tujuh tahun tidak bertemu, tidak berkabar, tidak ada penjelasan. Dan kini mereka berdiri di rumah duka, dikelilingi karangan bunga dan orang-orang yang berbisik—mungkin bertanya-tanya siapa wanita muda yang menangis di depan foto almarhum.</p>
<p>"Kita perlu ngobrol," kata Kania tiba-tiba. "Tapi bukan di sini. Nanti. Setelah semuanya selesai."</p>
<p>Arman mengangguk pelan. "Aku tunggu di tempat biasa."</p>
<p>Kania tidak menanyakan "tempat biasa" yang mana. Ia tahu. Ia selalu tahu.</p>
<p>—</p>
<p>Pemakaman berlangsung siang itu di TPU Menteng Pulo. Langit cerah, kontras dengan suasana hati semua orang. Kania berdiri di samping Rendra, menyaksikan peti Ayah diturunkan ke dalam tanah. Satu demi satu, orang melemparkan bunga. Tanah. Kenangan.</p>
<p>Rendra tidak menangis. Adiknya itu hanya berdiri tegak, rahang mengeras, menatap lurus ke depan seolah seluruh dunia adalah medan perang yang harus ia taklukkan. Kania tahu adiknya marah. Marah karena ditinggal Ayah. Marah karena ditinggal kakaknya. Marah karena semuanya.</p>
<p>"Ren," bisik Kania setelah pemakaman selesai, saat orang-orang mulai membubarkan diri. "Kita belum sempat ngobrol. Aku..."</p>
<p>"Ngobrol apa, Mbak?" Rendra akhirnya menoleh. Matanya merah, tapi bukan karena menangis. "Mau ngobrol tentang kenapa Mbak pergi tujuh tahun tanpa kabar? Tentang gimana Ayah nungguin Mbak tiap Lebaran? Tentang gimana aku harus ngurus Ayah sendirian pas dia mulai sakit-sakitan?"</p>
<p>"Ren..."</p>
<p>"Mbak mau minta maaf? Silakan. Tapi maaf nggak akan bikin Ayah hidup lagi. Maaf nggak akan bikin tujuh tahun itu kembali." Rendra berbalik dan berjalan pergi. "Aku tunggu di mobil."</p>
<p>Kania berdiri sendirian di tepi makam Ayahnya. Angin sore berhembus, membawa bau tanah basah dan bunga melati. Untuk pertama kalinya, ia menyadari betapa dalam luka yang ia tinggalkan—bukan hanya pada Ayahnya, tapi juga pada adiknya. Dan mungkin juga pada Arman.</p>
<p>—</p>
<p>Sore itu, setelah memastikan Rendra pulang ke rumahnya sendiri (masih dengan suasana dingin), Kania berjalan kaki ke tempat yang tidak pernah ia lupakan: sebuah warung kopi kecil di ujung gang, di belakang Stasiun Cikini.</p>
<p>Warung itu masih ada. Masih dengan meja kayu dan kursi plastik yang sama. Masih dengan menu es kopi susu yang dulu selalu mereka pesan berdua.</p>
<p>Dan Arman sudah duduk di sana, di meja paling pojok—meja yang selalu menjadi meja mereka.</p>
<p>"Kamu ingat," kata Kania, duduk di hadapannya.</p>
<p>"Aku ingat semuanya, Nia. Itu masalahnya."</p>
<p>Kania menatap kopi yang sudah disediakan untuknya. Es kopi susu. Pesanannya. Arman masih ingat.</p>
<p>"Kenapa kamu pergi?" Suara Arman pelan, tapi penuh dengan sesuatu yang sudah tertahan terlalu lama. "Kenapa kamu ninggalin aku tanpa kabar? Tanpa satu kata pun?"</p>
<p>Kania menggenggam gelas kopinya, merasakan dingin yang menjalar. "Karena aku pengecut."</p>
<p>"Itu bukan jawaban."</p>
<p>"Ayahku... Ayah dulu nggak setuju aku sama kamu. Dia bilang aku harus fokus kuliah, fokus karier, jangan mikirin pacaran dulu. Dan aku..." Suara Kania bergetar. "Aku nurut."</p>
<p>"Jadi selama tujuh tahun, kamu nurut aja? Nggak pernah mikir buat hubungi aku?"</p>
<p>"Aku malu, Arman. Malu karena aku pergi tanpa pamit. Malu karena aku nggak berani melawan Ayah. Dan makin lama, makin susah buat ngomong. Sampai akhirnya... aku pikir lebih baik kamu lupa aja sama aku."</p>
<p>Arman menatapnya lama. Ekspresinya sulit dibaca. Lalu, perlahan, ia tersenyum. Bukan senyum bahagia—senyum getir.</p>
<p>"Aku nggak pernah lupa, Nia. Aku malah nunggu. Dua tahun pertama, aku masih berharap kamu bakal balik. Tiga tahun berikutnya, aku coba move on. Tapi..." Ia menghela napas. "Tapi setiap kali hujan, aku ingat kamu. Setiap kali dengar lagu Dewa 19, aku ingat kamu. Setiap kali lewat sini, aku ingat kamu."</p>
<p>Air mata mulai mengalir di pipi Kania. "Maaf..."</p>
<p>"Aku nggak marah, Nia. Nggak lagi. Dulu iya. Tapi sekarang..." Arman menatapnya dengan mata yang hangat—mata yang sama yang dulu selalu menatapnya dari seberang meja. "Kamu udah pulang. Itu aja udah cukup."</p>
<p>Mereka duduk dalam diam. Dua orang yang pernah jadi segalanya satu sama lain, kini belajar untuk jadi asing lagi. Atau mungkin, mencoba untuk tidak lagi asing.</p>
<p>Di luar, hujan mulai turun. Rintik demi rintik. Seperti Jakarta yang ikut menangis. Atau mungkin, ikut membersihkan.</p>`,
    isPremium: false,
    price: 0,
    readCount: 830,
    status: "PUBLISHED",
  },
  {
    id: "15",
    workId: "5",
    workSlug: "antara-jakarta-dan-kenangan",
    chapterNumber: 3,
    slug: "rumah-yang-dulu",
    title: "Rumah yang Dulu",
    content: `<p>Seminggu setelah pemakaman, Kania dan Rendra akhirnya bicara. Bukan di rumah duka atau di pemakaman, tapi di dapur rumah masa kecil mereka—tempat di mana dulu, saat Ibu masih hidup, mereka bertiga biasa memasak bersama.</p>
<p>Rumah itu sekarang hampir kosong. Sebagian besar perabotan sudah dijual atau disumbangkan. Yang tersisa hanya kenangan: noda di dinding tempat Rendra kecil menggambar pesawat tempur, bekas pensil di kusen pintu tempat Ayah mengukur tinggi badan mereka, lemari dapur yang pintunya selalu macet.</p>
<p>"Mbak mau balik ke Melbourne?" tanya Rendra, memecah kesunyian.</p>
<p>Kania mengaduk tehnya. "Aku belum tahu."</p>
<p>"Bukannya Mbak udah punya hidup di sana? Kerjaan? Apartemen?"</p>
<p>"Hidupku di sana cuma pelarian, Ren." Kania akhirnya mengatakan apa yang selama ini ia pendam. "Aku pergi ke Melbourne bukan karena aku mau. Tapi karena aku takut. Takut menghadapi Ayah. Takut menghadapi Arman. Takut menghadapi diriku sendiri."</p>
<p>Rendra menatap kakaknya. "Kenapa baru ngomong sekarang?"</p>
<p>"Karena sekarang aku udah nggak bisa ngomong sama Ayah. Dan aku nggak mau terlambat ngomong sama kamu."</p>
<p>Untuk pertama kalinya sejak Kania tiba, ekspresi tegang di wajah Rendra sedikit melunak. "Ayah itu keras, Mbak. Tapi bukan berarti dia nggak sayang. Dia cuma nggak bisa ngomong. Kayak... kayak Mbak."</p>
<p>Kania tersenyum pahit. "Aku tahu."</p>
<p>"Dulu, sebelum Ayah meninggal, dia sering ngomongin Mbak. Dia bilang dia nyesel. Dia bilang dia terlalu keras sama Mbak. Dia bilang..." Suara Rendra bergetar. "Dia bilang kalau Mbak pulang, dia mau minta maaf."</p>
<p>Kania menangis lagi. Entah untuk keberapa kalinya minggu ini. Tapi kali ini ada yang berbeda—ada kelegaan di antara air matanya. Karena setidaknya Ayah ingin minta maaf. Setidaknya Ayah masih sayang. Setidaknya, sebelum semuanya terlambat, ada niat untuk memperbaiki.</p>
<p>"Aku mau jual rumah ini," kata Rendra tiba-tiba. "Udah terlalu banyak kenangan. Aku nggak sanggup."</p>
<p>"Jangan." Suara Kania tegas. "Jangan dijual."</p>
<p>"Terus?"</p>
<p>"Aku yang tinggal di sini."</p>
<p>Rendra menatapnya tidak percaya. "Mbak serius? Mbak mau ninggalin Melbourne?"</p>
<p>"Melbourne bukan rumah, Ren. Di sana aku cuma ada. Di sini..." Kania menatap sekeliling dapur yang mulai dimakan usia. "Di sini aku hidup."</p>
<p>—</p>
<p>Kania bertemu Arman lagi keesokan harinya. Kali ini di tempat yang berbeda—bukan di warung kopi kenangan, tapi di sebuah taman kecil di tengah kota. Tempat yang dulu menjadi lokasi kencan pertama mereka.</p>
<p>Taman itu masih ada, meskipun lebih kecil dari yang Kania ingat. Mungkin karena ia sudah dewasa. Atau mungkin Jakarta memang semakin padat, menekan ruang-ruang yang dulu terasa begitu luas.</p>
<p>"Aku mutusin buat tinggal," kata Kania setelah mereka duduk di bangku taman yang sama—bangku yang entah mengapa masih di tempat yang sama, menghadap kolam kecil dengan air mancur yang sudah tidak berfungsi.</p>
<p>Arman menoleh. "Serius?"</p>
<p>"Aku udah kabur terlalu lama. Udah waktunya aku berhenti."</p>
<p>"Kamu nggak kabur, Nia. Kamu cuma... butuh waktu."</p>
<p>Kania tersenyum. "Kamu selalu cari pembenaran buat aku, ya?"</p>
<p>"Karena aku kenal kamu. Kamu bukan orang jahat. Kamu cuma orang yang bingung."</p>
<p>Kania menatap air mancur yang kering di depan mereka. "Arman... kamu udah punya pacar?"</p>
<p>Pertanyaan itu keluar begitu saja. Mungkin terlalu cepat. Mungkin tidak pantas. Tapi Kania harus tahu.</p>
<p>"Pernah," jawab Arman. "Beberapa kali. Tapi nggak ada yang serius."</p>
<p>"Kenapa?"</p>
<p>"Karena aku selalu bandingin mereka sama kamu."</p>
<p>Kania menoleh. "Jangan ngomong gitu."</p>
<p>"Ini jujur, Nia. Aku udah coba move on. Tapi setiap kali aku deket sama orang lain, selalu ada sesuatu yang kurang. Sesuatu yang... cuma kamu yang punya."</p>
<p>Kania tidak tahu harus merasa bagaimana. Senang karena masih ada yang mencintainya setelah bertahun-tahun. Atau sedih karena ia telah membuat seseorang menunggu begitu lama.</p>
<p>"Aku nggak minta kamu balikan sama aku," kata Arman cepat, seolah membaca pikirannya. "Aku cuma mau kamu tahu. Biar jelas. Biar nggak ada lagi yang disembunyiin di antara kita."</p>
<p>"Lalu kita gimana?"</p>
<p>"Kita mulai dari awal. Bukan sebagai Kania dan Arman yang dulu. Tapi sebagai Kania dan Arman yang sekarang." Arman mengulurkan tangan. "Halo. Aku Arman. Kamu siapa?"</p>
<p>Kania menatap tangan itu. Tangan yang sama yang dulu menggandengnya di taman ini. Tangan yang sama yang ia lepaskan tujuh tahun lalu.</p>
<p>Perlahan, ia menyambutnya. "Aku Kania. Senang bertemu denganmu."</p>
<p>Mereka berjabat tangan. Dan di taman kecil yang penuh kenangan itu, di bawah langit Jakarta yang mulai berwarna jingga, dua orang yang pernah saling kehilangan memutuskan untuk saling menemukan kembali.</p>
<p>Bukan sebagai masa lalu. Tapi sebagai masa depan yang baru.</p>
<p>—</p>
<p>Malam itu, Kania berdiri di depan rumah masa kecilnya—rumah yang kini akan menjadi rumahnya lagi. Rendra di sampingnya, membawa kardus berisi barang-barang yang belum sempat dikeluarkan.</p>
<p>"Mbak yakin?" tanya Rendra.</p>
<p>"Yakin."</p>
<p>Mereka masuk. Rumah itu sunyi dan berdebu, tapi Kania merasa—untuk pertama kalinya dalam tujuh tahun—bahwa ia ada di tempat yang tepat.</p>
<p>"Besok kita bersihin rumah ini," katanya. "Bersama. Kayak dulu."</p>
<p>Rendra tidak menjawab. Tapi sudut bibirnya terangkat sedikit. Dan itu cukup untuk Kania.</p>
<p>Jakarta di luar masih sama—bising, macet, penuh orang. Tapi bagi Kania, untuk pertama kalinya, kota ini terasa seperti rumah. Bukan karena tempatnya. Tapi karena orang-orang di dalamnya.</p>
<p>Ayah sudah pergi. Tapi Rendra masih ada. Arman masih ada. Dan Kania, yang selama ini hanya menjadi pengunjung dalam hidupnya sendiri, akhirnya berhenti berlari. Akhirnya pulang. Akhirnya menjadi bagian dari cerita yang dulu ia tinggalkan.</p>
<p>Dan antara Jakarta dan kenangan, Kania menemukan sesuatu yang selama ini ia cari di Melbourne. Sesuatu yang tidak bisa ditemukan di kota paling indah sekalipun: rumah.</p>`,
    isPremium: true,
    price: 5000,
    readCount: 390,
    status: "PUBLISHED",
  },
  {
    id: "16",
    workId: "6",
    workSlug: "pagi-yang-tertukar",
    chapterNumber: 1,
    slug: "kopi-dan-kesalahan",
    title: "Kopi dan Kesalahan",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/autukar01/800/600" alt="Pagi Senin. 07.15 WIB. Ara terlambat kuliah." loading="lazy" /><p>Ara: "Sial, lagi-lagi bangun kesiangan..."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar02/800/600" alt="Kedai kopi langganan. Ara pesan es kopi susu. Buru-buru." loading="lazy" /><p>Ara: "Mas, kopinya dibungkus aja ya. Gue buru-buru nih."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar03/800/600" alt="Di saat yang sama, Bima juga lagi buru-buru. Ponselnya identik dengan punya Ara." loading="lazy" /><p>Bima: "Satu americano panas ya, Mbak. Cepetan sedikit bisa?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar04/800/600" alt="Mereka ambil pesanan masing-masing. Tapi ponselnya... tertukar." loading="lazy" /><p>Ara: "Eh? Ini bukan hape gue..."</p></div>`,
    isPremium: false,
    price: 0,
    readCount: 1200,
    status: "PUBLISHED",
  },
  {
    id: "17",
    workId: "6",
    workSlug: "pagi-yang-tertukar",
    chapterNumber: 2,
    slug: "hape-yang-salah",
    title: "Hape yang Salah",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/autukar05/800/600" alt="Ara baru sadar di kelas. Ponsel di tangannya ada wallpaper pemandangan gunung." loading="lazy" /><p>Ara: "Hape siapa nih?! Mana udah masuk kelas lagi..."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar06/800/600" alt="Bima di kantornya juga panik. Ponsel ini penuh notifikasi dari grup chat random." loading="lazy" /><p>Bima: "'Mbak Ara deadline tugas jam 10 nanti ya!' ... Lah, gue bukan Ara!"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar07/800/600" alt="Bima akhirnya telepon nomornya sendiri. Ara yang angkat." loading="lazy" /><p>Bima: "Halo? Ini pemilik hape yang ada stiker kucingnya ya?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar08/800/600" alt="Mereka sepakat ketemu sore ini di kedai kopi yang sama. Balikin ponsel." loading="lazy" /><p>Ara & Bima: "Jangan lupa ya. Jangan sampai ilang hape gue. — Lo juga."</p></div>`,
    isPremium: false,
    price: 0,
    readCount: 980,
    status: "PUBLISHED",
  },
  {
    id: "18",
    workId: "6",
    workSlug: "pagi-yang-tertukar",
    chapterNumber: 3,
    slug: "pertemuan-yang-direncanakan",
    title: "Pertemuan yang Direncanakan",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/autukar09/800/600" alt="Sore itu. Kedai kopi. Ara datang duluan. Bima datang sambil bawa dua es kopi susu." loading="lazy" /><p>Bima: "Ini... buat lo. Maaf ya tadi pagi bikin repot."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar10/800/600" alt="Tiga bulan kemudian. Masih di kedai kopi yang sama. Tapi sekarang mereka pesan bareng." loading="lazy" /><p>Ara: "Kali ini gue traktir. Tapi jangan sampe ketuker hape lagi ya."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar11/800/600" alt="Sabtu pagi. Pasar minggu. Bima ngajak Ara jalan-jalan." loading="lazy" /><p>Bima: "Lo tau nggak sih... gue sengaja ketuker hape waktu itu."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar12/800/600" alt="Ara kaget. Bima tersenyum malu." loading="lazy" /><p>Bima: "Gue udah liat lo tiap pagi di kedai itu. Tiga bulan. Dan gue nggak pernah berani ngomong. Jadi pas liat hape lo persis kayak punya gue... ya gue tukar aja."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/autukar13/800/600" alt="Ara cuma bisa diam. Lalu ketawa." loading="lazy" /><p>Ara: "Lo sinting. Tapi... gue seneng. Karena lo ngaku."</p></div>`,
    isPremium: true,
    price: 5000,
    readCount: 620,
    status: "PUBLISHED",
  },
  {
    id: "19",
    workId: "7",
    workSlug: "stasiun-terakhir",
    chapterNumber: 1,
    slug: "gerbong-ke-tiga",
    title: "Gerbong ke Tiga",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/austasiun01/800/600" alt="Stasiun Kota. 23.47. Kereta terakhir tujuan Stasiun Akhir." loading="lazy" /><p>Setiap malam, pukul 23.47. Nara selalu ada di sini.</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun02/800/600" alt="Nara selalu duduk di gerbong ke-3. Di kursi dekat jendela. Selalu." loading="lazy" /><p>Nara: "Pulang kerja jam segini udah biasa sih. Tapi kenapa ya, gue selalu milih gerbong ini?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun03/800/600" alt="Revan selalu duduk di seberang. Tidak pernah bicara. Hanya membaca buku yang sama." loading="lazy" /><p>Nara: "Dia baca buku yang sama lagi? Udah seminggu dia belum ganti halaman..."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun04/800/600" alt="Minggu pertama. Mereka saling diam. Hanya melirik sekilas." loading="lazy" /><p>Penumpang lain berganti setiap malam. Tapi mereka berdua selalu sama. Selalu di gerbong ke-3.</p></div>`,
    isPremium: false,
    price: 0,
    readCount: 1800,
    status: "PUBLISHED",
  },
  {
    id: "20",
    workId: "7",
    workSlug: "stasiun-terakhir",
    chapterNumber: 2,
    slug: "hujan-dan-payung",
    title: "Hujan dan Payung",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/austasiun05/800/600" alt="Malam ke-10. Hujan deras. Revan tidak membawa payung." loading="lazy" /><p>Nara: "Mau nebeng payung? ... Gue liat lo selalu di sini. Aku Nara."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun06/800/600" alt="Malam itu mereka jalan bareng. Revan turun di stasiun yang sama." loading="lazy" /><p>Nara: "Lo turun di sini juga? Tumben. Biasanya lo selalu lanjut..."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun07/800/600" alt="Malam-malam berikutnya, mereka mulai bicara." loading="lazy" /><p>Revan: "Gue sebenarnya nggak baca buku ini. Cuma... gue butuh sesuatu buat dipegang. Biar nggak kelihatan sendirian."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun08/800/600" alt="Nara dan Revan. Dua orang yang sama-sama pulang ke rumah kosong." loading="lazy" /><p>Nara: "Besok malam... lo bakal di sini lagi kan?"</p></div>`,
    isPremium: false,
    price: 0,
    readCount: 1450,
    status: "PUBLISHED",
  },
  {
    id: "21",
    workId: "7",
    workSlug: "stasiun-terakhir",
    chapterNumber: 3,
    slug: "kopi-kaleng-dan-bintang",
    title: "Kopi Kaleng dan Bintang",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/austasiun09/800/600" alt="Malam hujan lagi. Revan menunggu dengan dua kopi kaleng." loading="lazy" /><p>Revan: "Gue beli dua. Biar lo nggak usah keluar duit. Anggep aja... bayaran buat payung lo."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun10/800/600" alt="Mereka duduk di bangku stasiun. Malam itu nggak hujan." loading="lazy" /><p>Revan: "Gue nggak mau cuma ketemu pas hujan. Mulai sekarang... gue bakal di sini. Setiap malam. Hujan atau nggak."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun11/800/600" alt="Nara tersenyum. Matanya berkaca-kaca. Tapi bukan karena sedih." loading="lazy" /><p>Nara: "Lo tau nggak... gue mulai terbiasa ada lo di gerbong ini. Dan gue nggak mau itu berubah."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun12/800/600" alt="Stasiun Kota. 23.47. Kereta terakhir." loading="lazy" /><p>Mereka belum tahu akan ke mana hubungan ini. Tapi malam ini, di kereta terakhir, dua orang asing ini sudah bukan asing lagi.</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/austasiun13/800/600" alt="Gerbong ke-3. Sekarang ada dua kopi kaleng. Dua payung. Dua buku yang akhirnya selesai dibaca." loading="lazy" /><p>Revan: "Gue udah ganti buku."<br/>Nara: "Akhirnya..."</p></div>`,
    isPremium: true,
    price: 5000,
    readCount: 780,
    status: "PUBLISHED",
  },
  {
    id: "22",
    workId: "8",
    workSlug: "kedai-hujan",
    chapterNumber: 1,
    slug: "teh-untuk-jiwa",
    title: "Teh untuk Jiwa",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/auhujan01/800/600" alt="Kota kecil di kaki gunung. Hampir setiap hari hujan di sini." loading="lazy" /><p>Ada sebuah kedai kecil yang hanya buka saat hujan. Namanya Kedai Hujan.</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan02/800/600" alt="Kedai itu hanya berisi empat meja dan sebuah jendela besar." loading="lazy" /><p>Jendela itu selalu menghadap jalanan basah. Dan di balik meja kayunya, Genta selalu berdiri.</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan03/800/600" alt="Genta, sang pemilik, membuat teh untuk setiap pelanggan." loading="lazy" /><p>Genta: "Teh jahe buat yang lagi rindu. Teh melati buat yang lagi kehilangan. Kamu yang mana?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan04/800/600" alt="Katanya, setiap teh yang ia sajikan bisa menyembuhkan satu kenangan." loading="lazy" /><p>Tapi Genta sendiri tidak pernah minum tehnya. Katanya, dia tidak punya kenangan yang ingin disembuhkan. Atau mungkin... dia tidak berani.</p></div>`,
    isPremium: false,
    price: 0,
    readCount: 2100,
    status: "PUBLISHED",
  },
  {
    id: "23",
    workId: "8",
    workSlug: "kedai-hujan",
    chapterNumber: 2,
    slug: "pelanggan-tanpa-payung",
    title: "Pelanggan Tanpa Payung",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/auhujan05/800/600" alt="Suatu sore, seorang gadis datang. Ia tidak basah. Tidak bawa payung." loading="lazy" /><p>Rania: "Tempat ini... katanya bisa bikin orang lupa?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan06/800/600" alt="Rania duduk di meja paling pojok. Ia tidak memesan teh." loading="lazy" /><p>Rania: "Gue nggak butuh lupa. Gue cuma... butuh ngerti. Kenapa dia pergi."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan07/800/600" alt="Genta membuatkan teh tanpa diminta. Teh melati." loading="lazy" /><p>Genta: "Ini bukan teh buat lupa. Ini teh buat menerima. Diminum pelan-pelan."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan08/800/600" alt="Rania minum seteguk. Hangatnya menjalar. Matanya berkaca-kaca." loading="lazy" /><p>Rania: "Kenapa rasanya... kayak pelukan? Gue udah lama nggak ngerasain dipeluk."</p></div>`,
    isPremium: false,
    price: 0,
    readCount: 1680,
    status: "PUBLISHED",
  },
  {
    id: "24",
    workId: "8",
    workSlug: "kedai-hujan",
    chapterNumber: 3,
    slug: "musim-kemarau-pun-tiba",
    title: "Musim Kemarau pun Tiba",
    content: `<div class="au-slide"><img src="https://picsum.photos/seed/auhujan09/800/600" alt="Hari-hari berikutnya, Rania selalu kembali. Kadang bawa buku, kadang cuma duduk diam." loading="lazy" /><p>Genta: "Lo percaya nggak kalau hujan itu cara langit bilang 'aku di sini'?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan10/800/600" alt="Musim hujan hampir berakhir. Rania masih datang." loading="lazy" /><p>Rania: "Teh lo... rasanya beda sekarang. Lebih manis."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan11/800/600" alt="Genta akhirnya duduk bersamanya. Pertama kalinya ia meninggalkan meja kayunya." loading="lazy" /><p>Genta: "Aku nggak pernah minum teh buatanku sendiri. Karena aku tahu... rasanya pahit. Kayak kenanganku. Tapi sejak lo datang... aku mulai bikin teh yang lebih manis."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan12/800/600" alt="Rania menatapnya. Di luar, hujan mulai reda." loading="lazy" /><p>Rania: "Kalau nanti hujannya berhenti... lo bakal tutup kedai ini?"</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan13/800/600" alt="Genta tersenyum. Pertama kalinya." loading="lazy" /><p>Genta: "Kedai ini cuma buka pas hujan. Tapi aku... mulai belajar buka diri. Dan itu nggak perlu nunggu hujan."</p></div>
<div class="au-slide"><img src="https://picsum.photos/seed/auhujan14/800/600" alt="Musim kemarau tiba. Kedai Hujan tutup. Tapi di depannya..." loading="lazy" /><p>Di depan kedai yang tutup, ada dua kursi. Dua cangkir teh. Dan dua orang yang sudah tidak lagi butuh hujan untuk bertemu.</p></div>`,
    isPremium: true,
    price: 5000,
    readCount: 920,
    status: "PUBLISHED",
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

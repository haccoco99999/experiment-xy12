/* Experiment 7 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp7 = {
    md: {
      title: 'TÌM HIỂU SỰ SINH SẢN VÀ VÒNG ĐỜI CỦA ĐỘNG VẬT ĐẺ TRỨNG – BƯỚM',
      /* the progress bar (md section III.1) */
      steps: ['BƯỚM ĐỰC + BƯỚM CÁI', 'GIAO PHỐI', 'THỤ TINH', 'BƯỚM CÁI ĐẺ TRỨNG', 'TRỨNG', 'SÂU NON', 'NHỘNG', 'BƯỚM TRƯỞNG THÀNH'],
      /* the tray (md sections 5.1–5.5) */
      tools: { male: 'BƯỚM ĐỰC', female: 'BƯỚM CÁI', lens: 'KÍNH LÚP', leaf: 'LÁ CÂY', ruler: 'THƯỚC ĐO' },
      /* name tags over the scene */
      labels: {
        male: 'BƯỚM ĐỰC', female: 'BƯỚM CÁI', pair: 'BƯỚM ĐỰC + BƯỚM CÁI', mating: 'GIAO PHỐI', zygote: 'TRỨNG ĐÃ THỤ TINH',
        eggs: 'TRỨNG', eggsLens: 'TRỨNG BƯỚM', larva: 'SÂU NON (ẤU TRÙNG)', moult: ['LẦN LỘT XÁC 1', 'LẦN LỘT XÁC 2', 'LẦN LỘT XÁC 3'],
        pupa: 'NHỘNG', cut: 'MẶT CẮT BÊN TRONG NHỘNG', adult: 'BƯỚM TRƯỞNG THÀNH'
      },
      /* the little timeline of the three moults and the goal shown with the ruler (md sections 17 and 19) */
      moultLine: ['LẦN 1', 'LẦN 2', 'LẦN 3'],
      growth: ['SÂU NHỎ', 'SÂU LỚN HƠN', 'SÂU TRƯỞNG THÀNH'],
      /* the fertilization diagram (md sections 8–9) */
      fert: { sperm: 'TINH TRÙNG CỦA BƯỚM ĐỰC', egg: 'TRỨNG CỦA BƯỚM CÁI', step: 'THỤ TINH' },
      days: ['NGÀY 0', 'NGÀY 3', 'NGÀY 7', 'NGÀY 14', 'NGÀY 18', 'NGÀY 28'],
      buttons: { go: '▶ TIẾP TỤC', hatch: '▶ CHUYỂN SANG GIAI ĐOẠN NỞ', cut: '[ MẶT CẮT 3D ]', emerge: '▶ TUA NHANH THỜI GIAN VŨ HÓA' },
      marks: { eggs: 'ĐÃ QUAN SÁT TRỨNG ✓', fed: 'ĐÃ CHO SÂU ĂN ✓', pupa: 'ĐÃ QUAN SÁT NHỘNG ✓', inside: 'ĐÃ QUAN SÁT BÊN TRONG NHỘNG ✓' },
      /* the four parts forming inside the pupa (md section 24) */
      parts: { wing: 'CÁNH ĐANG HÌNH THÀNH', eye: 'MẮT KÉP ĐANG HÌNH THÀNH', leg: 'CHÂN KHỚP ĐANG HÌNH THÀNH', proboscis: 'VÒI HÚT ĐANG HÌNH THÀNH' },
      /* wrong moves and the sentence that is also the task for each step (md section XXXVIII) */
      msg: {
        placeTask: 'Hãy đặt bướm vào khu vực quan sát.',
        maleOff: 'Hãy đặt bướm đực vào khu vực quan sát.',
        femaleOff: 'Hãy đặt bướm cái vào khu vực quan sát.',
        maleFar: 'Hãy đưa bướm đực đến gần bướm cái.',
        mateTask: 'Hãy đưa bướm đực đến gần bướm cái.',
        femaleLeaf: 'Hãy đặt bướm cái lên lá cây.',
        layTask: 'Hãy đặt bướm cái lên lá cây.',
        lensEggsOff: 'Hãy đưa kính lúp đến cụm trứng để quan sát.',
        lensEggsTask: 'Hãy đưa kính lúp đến cụm trứng để quan sát.',
        leafFar: 'Hãy đưa lá cây đến gần sâu non.',
        feedTask: 'Hãy đưa lá cây đến gần sâu non.',
        rulerFar: 'Hãy đưa thước đến gần sâu non để đo.',
        lensPupaOff: 'Hãy đưa kính lúp đến gần nhộng để quan sát.',
        lensPupaTask: 'Hãy đưa kính lúp đến gần nhộng để quan sát.',
        partOff: 'Hãy nhấp vào bộ phận đang hình thành bên trong nhộng.',
        partTask: 'Hãy nhấp vào bộ phận đang hình thành bên trong nhộng.',
        sortTask: 'Hãy kéo các thẻ và sắp xếp đúng vòng đời của bướm.',
        sortWrong: 'Chưa đúng. Hãy kiểm tra lại thứ tự các giai đoạn phát triển.',
        locked: 'Hãy hoàn thành bước trước để tiếp tục.'
      },
      right: {
        male: 'Bướm đực là bướm trưởng thành có khả năng tham gia sinh sản.',
        pair: 'Bướm đực và bướm cái trưởng thành có thể sinh sản.',
        mate: 'Bướm đực và bướm cái giao phối để thực hiện quá trình sinh sản.',
        fert: 'Thụ tinh xảy ra khi tinh trùng của bướm đực kết hợp với trứng của bướm cái.',
        afterFert: 'Sau khi thụ tinh, bướm cái chuẩn bị đẻ trứng trên lá cây.',
        layStart: 'Hãy quan sát bướm cái đẻ trứng trên lá cây.',
        laid: 'Bướm cái đẻ trứng trên mặt dưới của lá.',
        eggsLens: 'Trứng bướm rất nhỏ và bám trên mặt dưới lá.',
        eggsGrow: 'Trứng đang phát triển và chuẩn bị nở.',
        larva: 'Sâu non ăn rất nhiều lá cây, lớn nhanh và lột xác nhiều lần để tăng kích thước.',
        eating: 'Sâu non đang ăn lá.',
        length: 'Chiều dài sâu non đang tăng lên.',
        pupa: 'Sâu non đã hóa thành nhộng.',
        pupaStill: 'Bên ngoài nhộng bất động, nhưng bên trong cơ thể đang tiếp tục biến đổi.',
        emerging: 'Bướm đang chuẩn bị thoát khỏi vỏ nhộng.',
        adult: 'Bướm thoát khỏi vỏ nhộng, giương rộng đôi cánh khô ráo và có thể bay đi hút mật, bắt đầu vòng đời mới.'
      },
      /* sorting the four stages (md sections 30–34) */
      sort: {
        title: 'SẮP XẾP VÒNG ĐỜI CỦA BƯỚM',
        cards: ['TRỨNG', 'SÂU NON', 'NHỘNG', 'BƯỚM TRƯỞNG THÀNH'],       // card i belongs to VỊ TRÍ i + 1
        slots: ['VỊ TRÍ 1', 'VỊ TRÍ 2', 'VỊ TRÍ 3', 'VỊ TRÍ 4'],
        hint: 'TRỨNG → SÂU NON → NHỘNG → BƯỚM TRƯỞNG THÀNH',
        right: 'Chính xác! Em đã sắp xếp đúng vòng đời của bướm.',
        summary: 'Bướm phát triển qua 4 giai đoạn: trứng, sâu non, nhộng và bướm trưởng thành. Bướm trưởng thành tiếp tục sinh sản, tạo ra thế hệ bướm mới.'
      },
      /* the big diagram (md section 35), top to bottom */
      diagram: ['BƯỚM ĐỰC + BƯỚM CÁI', 'GIAO PHỐI', 'THỤ TINH', 'BƯỚM CÁI ĐẺ TRỨNG', 'TRỨNG', 'SÂU NON', 'NHỘNG', 'BƯỚM TRƯỞNG THÀNH', 'TIẾP TỤC SINH SẢN', 'THẾ HỆ BƯỚM MỚI'],
      /* the end (md sections 53, 54 and 58) */
      finish: {
        title: 'HOÀN THÀNH THÍ NGHIỆM',
        line: 'Em đã quan sát được quá trình sinh sản và vòng đời của bướm.',
        chain: ['BƯỚM ĐỰC + BƯỚM CÁI', 'GIAO PHỐI', 'THỤ TINH', 'ĐẺ TRỨNG', 'TRỨNG', 'SÂU NON', 'NHỘNG', 'BƯỚM TRƯỞNG THÀNH', 'TIẾP TỤC SINH SẢN'],
        message: 'Em đã quan sát được sự sinh sản và vòng đời của bướm từ khi bướm trưởng thành sinh sản cho đến khi hình thành bướm trưởng thành mới.',
        conclusionTitle: 'KẾT LUẬN',
        conclusion: [
          'Bướm là động vật đẻ trứng. Trong quá trình sinh sản, bướm đực và bướm cái giao phối, sau đó xảy ra thụ tinh. Bướm cái đẻ trứng trên lá cây.',
          'Bướm phát triển qua 4 giai đoạn: trứng → sâu non → nhộng → bướm trưởng thành. Bướm trưởng thành tiếp tục sinh sản, tạo ra thế hệ bướm mới.'
        ],
        conclusionLast: 'Bướm đẻ trứng và phát triển qua 4 giai đoạn: trứng, sâu non, nhộng và bướm trưởng thành. Bướm trưởng thành tiếp tục sinh sản, tạo thành một vòng đời mới.'
      }
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 7: ',
      help: [
        'Kéo bướm đực và bướm cái từ khay bên trái, thả vào khu vườn. Sau đó kéo bướm đực đến gần bướm cái.',
        'Xem sơ đồ thụ tinh, bấm TIẾP TỤC, rồi kéo bướm cái từ khay lên lá cây để đẻ trứng.',
        'Kéo kính lúp đến cụm trứng, bấm CHUYỂN SANG GIAI ĐOẠN NỞ. Khi sâu non xuất hiện, kéo lá cây đến gần sâu để cho ăn. Kéo thước đo đến gần sâu để đo chiều dài.',
        'Khi nhộng xuất hiện, kéo kính lúp đến nhộng, bấm MẶT CẮT 3D và nhấp vào các chấm sáng bên trong nhộng. Sau đó bấm TUA NHANH THỜI GIAN VŨ HÓA.',
        'Khi bướm mới xuất hiện, kéo bốn thẻ vào đúng thứ tự vòng đời. Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      busy: 'Em chờ một chút nhé.',
      zone: 'KHU VỰC QUAN SÁT',
      lensNothing: 'Hãy đưa kính lúp đến trứng, sâu non hoặc nhộng.',
      lensOn: 'Kính lúp đang cho em nhìn gần hơn. Nhấp vào kính để cất đi.',
      timeTitle: 'THỜI GIAN',
      stageTitle: 'GIAI ĐOẠN',
      tapDots: 'Nhấp vào các chấm sáng để xem từng bộ phận bên trong nhộng.',
      keepGoing: 'Đợi một chút, sâu non đang lớn lên.',
      hintChain: 'Gợi ý',
      diagramTitle: 'SƠ ĐỒ TỔNG HỢP',
      conclusionTitle: 'KẾT LUẬN',
      moultTitle: 'SÂU NON LỚN LÊN',
      cardsTitle: 'THẺ GIAI ĐOẠN',
      sortHelp: 'Kéo mỗi thẻ vào đúng vị trí trên bàn.',
      rulerAway: 'Nhấp để cất thước đo',
      newLife: 'Bướm mới bắt đầu một vòng đời mới.'
    }
  };
})(window.Lab);

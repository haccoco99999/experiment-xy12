/* Experiment 5 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp5 = {
    md: {
      title: 'TÌM HIỂU CƠ QUAN SINH SẢN CỦA THỰC VẬT CÓ HOA VÀ QUÁ TRÌNH TẠO QUẢ, HẠT Ở CÂY CÀ CHUA',
      steps: ['Cấu tạo hoa', 'Thụ phấn', 'Thụ tinh', 'Quả', 'Hạt', 'Cây con'],
      tray: { flower: 'Hoa cà chua', lens: 'Kính lúp 3D', stick: 'Que lấy phấn' },
      info: { head: ['Thông tin', 'Hoa A'], rows: [['Loài', 'Cà chua'], ['Giai đoạn', 'Đang nở hoa'], ['Màu hoa', 'Vàng'], ['Trạng thái', 'Khỏe mạnh'], ['Nhị', 'Có'], ['Nhụy', 'Có']], close: 'X' },
      buttons: { structure: 'QUAN SÁT CẤU TẠO HOA', pollinate: 'THỰC HIỆN THỤ PHẤN', lapse: 'BẮT ĐẦU QUAN SÁT SỰ TẠO QUẢ VÀ HẠT' },
      /* the parts to look at, in the order the student has to look at them (md sections 10–12 and 35) */
      parts: { stamen: 'NHỊ', filament: 'CHỈ NHỊ', anther: 'BAO PHẤN', pistil: 'NHỤY', stigma: 'ĐẦU NHỤY', style: 'VÒI NHỤY', ovary: 'BẦU NHỤY', ovule: 'NOÃN' },
      desc: { anther: 'Là phần nằm ở đầu chỉ nhị.', stigma: 'Là phần ở trên cùng của nhụy.', style: 'Là phần nối đầu nhụy với bầu nhụy.', ovary: 'Là phần nằm phía dưới của nhụy.' },
      /* what the student is told when a move is wrong (md sections 6, 16, 18, 20–23, 46) */
      msg: {
        placeFirst: 'Hãy đặt hoa cà chua lên bàn trước.',
        collectWrong: 'Hãy đưa que đến bao phấn để lấy hạt phấn.',
        pollenWrong: 'Hãy đưa hạt phấn đến đầu nhụy.',
        clickPollen: 'Hãy nhấp vào hạt phấn trên đầu nhụy.',
        tubeWrong: 'Hãy đưa ống phấn đi xuống qua vòi nhụy.',
        ovuleWrong: 'Hãy đưa đầu ống phấn đến một noãn.',
        maleWrong: 'Hãy đưa tế bào sinh dục đực theo ống phấn vào bên trong noãn.'
      },
      /* the tasks shown before a move */
      prompt: {
        clickPollen: 'Hãy nhấp vào hạt phấn trên đầu nhụy.',
        tubeTask: 'Kéo ống phấn đi qua vòi nhụy xuống bầu nhụy.',
        ovuleTask: 'Đưa đầu ống phấn đến một noãn.',
        maleTask: 'Kéo tế bào sinh dục đực vào bên trong noãn.',
        fertGuide: 'Hãy quan sát và thực hiện quá trình đưa tế bào sinh dục đực đến noãn.'
      },
      right: {
        anther: 'Bao phấn chứa và tạo ra hạt phấn.',
        collected: 'Đã lấy hạt phấn từ bao phấn.',
        pollinated: 'Thụ phấn đã xảy ra.',
        pollinatedWhy: 'Thụ phấn là quá trình hạt phấn được chuyển từ bao phấn đến đầu nhụy.',
        germinated: 'Hạt phấn nảy mầm và hình thành ống phấn.',
        ovuleReached: 'Ống phấn đã đến noãn.',
        fertBig: 'THỤ TINH ĐÃ XẢY RA',
        fertWhy: 'Tế bào sinh dục đực kết hợp với tế bào sinh dục cái trong noãn.',
        day7: 'Sau khi thụ tinh, bầu nhụy phát triển thành quả.',
        day14: 'Nhấp vào quả để quan sát bên trong.',
        seeds: 'Sau khi thụ tinh, noãn phát triển thành hạt.',
        ripe: 'Quả cà chua đã chín. Nhấp vào quả để quan sát các hạt bên trong.',
        manySeeds: 'Quả cà chua chứa nhiều hạt.'
      },
      labels: { pollen: 'HẠT PHẤN', tube: 'ỐNG PHẤN', male: 'TẾ BÀO SINH DỤC ĐỰC', female: 'TẾ BÀO SINH DỤC CÁI', fruit: 'QUẢ', seed: 'HẠT', arrow: 'BẦU NHỤY → QUẢ' },
      days: ['Ngày 0', 'Ngày 3', 'Ngày 7', 'Ngày 14', 'Ngày 21', 'Ngày 30'],
      finish: { title: 'HOÀN THÀNH', chain: 'NHỊ → HẠT PHẤN → THỤ PHẤN → ỐNG PHẤN → NOÃN → THỤ TINH → BẦU NHỤY THÀNH QUẢ → NOÃN THÀNH HẠT → QUẢ CHÍN CÓ HẠT.' },
      result: {
        title: 'KẾT QUẢ THÍ NGHIỆM',
        lines: [
          'Hoa có cơ quan sinh sản là nhị và nhụy.',
          'Bao phấn chứa và tạo ra hạt phấn.',
          'Thụ phấn là quá trình hạt phấn được chuyển từ bao phấn đến đầu nhụy.',
          'Sau khi hạt phấn đến đầu nhụy, hạt phấn có thể nảy mầm và hình thành ống phấn.',
          'Ống phấn phát triển qua vòi nhụy và đi đến noãn.',
          'Tế bào sinh dục đực theo ống phấn đi vào noãn và kết hợp với tế bào sinh dục cái. Đây là quá trình thụ tinh.',
          'Sau khi thụ tinh, bầu nhụy phát triển thành quả.',
          'Sau khi thụ tinh, noãn phát triển thành hạt.',
          'Quả cà chua tiếp tục phát triển, chuyển từ quả xanh sang quả chín và bên trong chứa nhiều hạt.'
        ],
        diagramTitle: 'SƠ ĐỒ KIẾN THỨC CUỐI CÙNG',
        /* each row is drawn as one line; rows with several items are joined by arrows or shown side by side */
        diagram: [
          ['NHỊ', 'BAO PHẤN', 'HẠT PHẤN'], ['THỤ PHẤN'], ['ĐẦU NHỤY'], ['HẠT PHẤN NẢY MẦM'], ['ỐNG PHẤN'], ['NOÃN'],
          ['TẾ BÀO SINH DỤC ĐỰC + TẾ BÀO SINH DỤC CÁI'], ['THỤ TINH'], ['BẦU NHỤY → QUẢ', 'NOÃN → HẠT'], ['QUẢ CHÍN CÓ HẠT']
        ]
      }
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 5: ',
      help: [
        'Kéo hoa cà chua từ khay bên trái, thả lên bàn quan sát. Nhấp vào hoa để xem thông tin.',
        'Kéo kính lúp đến gần hoa, rồi bấm QUAN SÁT CẤU TẠO HOA. Nhấp vào chấm đang nhấp nháy để xem từng bộ phận theo thứ tự.',
        'Khi đã xem hết các bộ phận, bấm THỰC HIỆN THỤ PHẤN. Kéo que lấy phấn đến bao phấn, rồi kéo que có hạt phấn đến đầu nhụy.',
        'Nhấp vào hạt phấn trên đầu nhụy, kéo ống phấn xuống qua vòi nhụy, đưa đến một noãn, rồi kéo tế bào sinh dục đực vào noãn.',
        'Bấm BẮT ĐẦU QUAN SÁT SỰ TẠO QUẢ VÀ HẠT và làm theo các thông báo. Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      busy: 'Em chờ một chút nhé.',
      placed: 'Đã đặt hoa cà chua. Hãy kéo kính lúp đến gần hoa.',
      dragFlower: 'Kéo hoa cà chua từ khay lên bàn quan sát để bắt đầu.',
      dragLens: 'Kéo kính lúp đến gần hoa.',
      flowerOff: 'Hãy đặt hoa cà chua lên bàn thí nghiệm.',
      lensOff: 'Hãy đưa kính lúp đến gần hoa.',
      lensOn: 'Kính lúp đang phóng đại hoa. Nhấp vào kính để cất đi.',
      lensHint: 'Bấm QUAN SÁT CẤU TẠO HOA để xem bên trong hoa.',
      tapDots: 'Nhấp vào chấm đang nhấp nháy để xem bộ phận tiếp theo.',
      obsOrder: 'Hãy quan sát {0} trước nhé.',
      obsDone: 'Em đã quan sát xong các bộ phận. Bấm THỰC HIỆN THỤ PHẤN.',
      stickLocked: 'Hãy quan sát xong cấu tạo hoa và bấm THỰC HIỆN THỤ PHẤN trước nhé.',
      stickDone: 'Hoa đã được thụ phấn rồi.',
      toAnther: 'Hãy kéo que lấy phấn đến bao phấn.',
      toStigma: 'Hãy kéo que có hạt phấn đến đầu nhụy.',
      loaded: 'CÓ PHẤN',
      partsTitle: 'BỘ PHẬN CỦA HOA',
      timeTitle: 'THỜI GIAN',
      keepGoing: 'TIẾP TỤC TUA NHANH',
      tapFruit: 'Nhấp vào quả.',
      results: 'KẾT LUẬN'
    }
  };
})(window.Lab);

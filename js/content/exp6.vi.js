/* Experiment 6 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp6 = {
    md: {
      title: 'TÌM HIỂU SỰ HÌNH THÀNH CÂY CON TỪ HẠT, RỄ, THÂN VÀ LÁ CỦA THỰC VẬT',
      steps: ['CHUẨN BỊ', 'ĐẶT MẪU', 'TƯỚI NƯỚC', 'QUAN SÁT', 'CÂY CON', 'PHÂN LOẠI', 'CÂY TRƯỞNG THÀNH', 'HOÀN THÀNH'],
      /* the tray: four samples, four pots, the soil, the watering can and the magnifier (md section 3, in this order) */
      samples: ['Hạt đậu xanh', 'Mẫu rễ khoai lang', 'Củ khoai tây có mắt', 'Lá cây thuốc bỏng'],
      pots: ['Chậu 1 – ĐẬU XANH', 'Chậu 2 – KHOAI LANG', 'Chậu 3 – KHOAI TÂY', 'Chậu 4 – THUỐC BỎNG'],
      tools: { soil: 'Đất trồng', can: 'Bình tưới nước', lens: 'Kính phóng đại 3D' },
      /* the four fixed places on the table (md section 11) */
      places: ['CHẬU 1 – HẠT ĐẬU XANH', 'CHẬU 2 – RỄ KHOAI LANG', 'CHẬU 3 – THÂN KHOAI TÂY', 'CHẬU 4 – LÁ THUỐC BỎNG'],
      msg: {
        potWrong: 'Hãy đặt chậu vào đúng vị trí.',
        wrong0: 'Chưa đúng. Hãy đặt hạt đậu xanh vào CHẬU 1.',
        wrong1: 'Chưa đúng. Hãy đặt rễ khoai lang vào CHẬU 2.',
        wrong2: 'Chưa đúng. Hãy đặt khoai tây vào CHẬU 3.',
        wrong3: 'Chưa đúng. Hãy đặt lá thuốc bỏng vào CHẬU 4.',
        waterOff: 'Hãy tưới nước vào chậu cây.',
        classWrong: 'Chưa đúng. Hãy quan sát lại thí nghiệm.'
      },
      right: {
        pot: 'Đã đặt chậu đúng vị trí.',
        sample0: 'Đúng! Đây là hạt đậu xanh.',
        sample1: 'Đúng! Đây là rễ khoai lang.',
        sample2: 'Đúng! Đây là thân khoai tây có mắt có khả năng phát triển thành cây mới.',
        sample3: 'Đúng! Đây là lá cây thuốc bỏng có khả năng hình thành cây con.',
        water: 'Đã cung cấp nước.',
        germ: 'Hạt bắt đầu nảy mầm.',
        made: ['Cây con được hình thành từ hạt.', 'Cây con được hình thành từ rễ khoai lang.', 'Cây con được hình thành từ thân khoai tây.', 'Cây con được hình thành từ lá.'],
        classOne: 'Chính xác!',
        classAll: 'Em đã phân loại đúng 4 cách hình thành cây con.'
      },
      start: '▶ BẮT ĐẦU QUAN SÁT',
      days: ['NGÀY 0', 'NGÀY 2', 'NGÀY 4', 'NGÀY 7', 'NGÀY 14'],
      stages: { young: 'CÂY CON', growing: 'CÂY LỚN DẦN', mature: 'CÂY TRƯỞNG THÀNH' },
      plantlets: 'CÂY CON ĐÃ HÌNH THÀNH',
      /* what the magnifier names over each pot (md sections 22–25) */
      lens: ['HẠT ĐẬU XANH', 'RỄ KHOAI LANG', 'MẮT KHOAI TÂY', 'MÉP LÁ THUỐC BỎNG'],
      /* the closer view of one pot (md section 34) */
      zoom: ['ĐẬU XANH – HÌNH THÀNH TỪ HẠT', 'KHOAI LANG – HÌNH THÀNH TỪ RỄ', 'KHOAI TÂY – HÌNH THÀNH TỪ THÂN', 'THUỐC BỎNG – HÌNH THÀNH TỪ LÁ'],
      back: '← QUAY LẠI QUAN SÁT 4 CHẬU',
      classify: { task: 'Hãy kéo mỗi thẻ vào đúng cây.', cards: ['HẠT', 'RỄ', 'THÂN', 'LÁ'] },
      table: {
        head: ['Chậu', 'Vật mẫu', 'Cây con hình thành từ'],
        rows: [['Chậu 1', 'Hạt đậu xanh', 'Hạt'], ['Chậu 2', 'Rễ khoai lang', 'Rễ'], ['Chậu 3', 'Củ khoai tây', 'Thân'], ['Chậu 4', 'Lá thuốc bỏng', 'Lá']]
      },
      compare: ['HẠT → CÂY ĐẬU XANH', 'RỄ → CÂY KHOAI LANG', 'THÂN → CÂY KHOAI TÂY', 'LÁ → CÂY THUỐC BỎNG'],
      result: {
        title: 'KẾT QUẢ THÍ NGHIỆM',
        lines: ['HẠT ĐẬU XANH → CÂY CON', 'RỄ KHOAI LANG → CÂY CON', 'THÂN KHOAI TÂY → CÂY CON', 'LÁ THUỐC BỎNG → CÂY CON'],
        sentence: 'Cây con có thể hình thành từ những bộ phận khác nhau của thực vật.',
        conclusion: 'Từ hạt, rễ, thân hoặc lá của thực vật, cây con có thể hình thành. Cây con tiếp tục phát triển rễ, thân và lá để trở thành cây trưởng thành.',
        /* one chain per pot, top to bottom (md section 70) */
        diagram: [
          ['HẠT', 'CÂY ĐẬU XANH CON', 'CÂY ĐẬU XANH TRƯỞNG THÀNH'], ['RỄ KHOAI LANG', 'CÂY KHOAI LANG CON', 'CÂY KHOAI LANG TRƯỞNG THÀNH'],
          ['THÂN KHOAI TÂY', 'CÂY KHOAI TÂY CON', 'CÂY KHOAI TÂY TRƯỞNG THÀNH'], ['LÁ THUỐC BỎNG', 'CÂY CON', 'CÂY THUỐC BỎNG TRƯỞNG THÀNH']
        ]
      }
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 6: ',
      help: [
        'Kéo từng chậu từ khay bên trái, thả vào đúng vị trí có nhãn trên bàn. Sau đó kéo từng vật mẫu vào đúng chậu của nó.',
        'Kéo bình tưới đến từng chậu để tưới nước. Khi cả 4 chậu đã được tưới, bấm BẮT ĐẦU QUAN SÁT.',
        'Kéo kính phóng đại đến một chậu để nhìn gần. Nhấp vào một chậu để phóng to chậu đó, bấm QUAY LẠI QUAN SÁT 4 CHẬU để trở về.',
        'Khi 4 cây con đã hình thành, kéo mỗi thẻ HẠT, RỄ, THÂN, LÁ vào đúng cây. Sau đó bấm TIẾP TỤC TUA NHANH để xem cây lớn lên.',
        'Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      potsTask: 'Hãy kéo từng chậu vào đúng vị trí trên bàn.',
      sampleTask: 'Hãy kéo từng vật mẫu vào đúng chậu của nó.',
      waterTask: 'Hãy dùng bình tưới để tưới nước cho cả 4 chậu.',
      startTask: 'Bấm BẮT ĐẦU QUAN SÁT.',
      classTask: 'Hãy kéo mỗi thẻ vào đúng cây.',
      growTask: 'Bấm TIẾP TỤC TUA NHANH để xem cây con lớn lên.',
      busy: 'Em chờ một chút nhé.',
      potsFirst: 'Hãy đặt đủ 4 chậu lên bàn trước.',
      samplesFirst: 'Hãy đặt đủ 4 vật mẫu vào chậu trước.',
      lensOff: 'Hãy đưa kính phóng đại đến một chậu.',
      lensEmpty: 'Chậu này chưa có vật mẫu. Hãy đặt vật mẫu vào chậu trước.',
      soilHave: 'Chậu đã có đất rồi.',
      lensOn: 'Kính phóng đại đang cho em nhìn gần hơn. Nhấp vào kính để cất đi.',
      keepGoing: 'TIẾP TỤC TUA NHANH',
      timeTitle: 'THỜI GIAN',
      tapPot: 'Nhấp vào một chậu để nhìn gần hơn.',
      tableTitle: 'BẢNG SO SÁNH',
      conclusionTitle: 'KẾT LUẬN',
      diagramTitle: 'SƠ ĐỒ TỔNG KẾT'
    }
  };
})(window.Lab);

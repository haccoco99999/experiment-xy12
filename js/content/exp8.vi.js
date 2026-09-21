/* Experiment 8 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp8 = {
    md: {
      title: 'TÌM HIỂU SỰ SINH SẢN VÀ VÒNG ĐỜI CỦA ĐỘNG VẬT ĐẺ CON – MÈO',
      /* the progress bar (md section VII) */
      steps: ['MÈO ĐỰC + MÈO CÁI', 'TINH TRÙNG + TRỨNG', 'THỤ TINH', 'HỢP TỬ', 'PHÔI', 'THAI', 'MÈO CON', 'MÈO CON LỚN DẦN', 'MÈO TRƯỞNG THÀNH'],
      stageTitles: ['GIAI ĐOẠN 1: MÈO ĐỰC VÀ MÈO CÁI', 'GIAI ĐOẠN 2: TINH TRÙNG VÀ TRỨNG', 'GIAI ĐOẠN 3: THỤ TINH', 'GIAI ĐOẠN 4: HỢP TỬ', 'GIAI ĐOẠN 5: HỢP TỬ PHÁT TRIỂN THÀNH PHÔI',
        'GIAI ĐOẠN 6: PHÔI PHÁT TRIỂN THÀNH THAI', 'GIAI ĐOẠN 7: MÈO CON', 'GIAI ĐOẠN 8: MÈO CON LỚN DẦN', 'GIAI ĐOẠN 9: MÈO TRƯỞNG THÀNH'],
      /* the tray (md sections 4.1–4.3) and the observation table (4.1, 4.2) */
      tools: { male: 'MÈO ĐỰC', female: 'MÈO CÁI', lens: 'KÍNH PHÓNG ĐẠI' },
      info: { head: ['Thông tin', 'Nội dung'], species: ['Loài', 'Mèo'], sex: ['Giới tính', 'Đực', 'Cái'], stage: ['Giai đoạn', 'Trưởng thành'], health: ['Tình trạng', 'Khỏe mạnh'] },
      buttons: { start: '▶ BẮT ĐẦU QUAN SÁT SỰ SINH SẢN VÀ VÒNG ĐỜI', embryo: '▶ THEO DÕI HỢP TỬ PHÁT TRIỂN', review: 'XEM LẠI THÍ NGHIỆM', reviewStage: 'XEM LẠI GIAI ĐOẠN' },
      /* name tags over the scene */
      labels: {
        male: 'MÈO ĐỰC', female: 'MÈO CÁI', sperm: 'TINH TRÙNG', egg: 'TRỨNG', zygoteTitle: 'THỤ TINH ĐÃ XẢY RA', kittenNew: 'MÈO CON MỚI SINH',
        compare: ['MÈO CON MỚI SINH', 'MÈO CON 1 THÁNG', 'MÈO CON 2 THÁNG'], embryo: 'PHÔI'
      },
      cellInfo: { sperm: 'Tế bào sinh dục đực', egg: 'Tế bào sinh dục cái' },
      /* wrong moves and the sentence that is also the task for each step */
      msg: {
        placeMaleTask: 'Hãy kéo mèo đực vào khu vực quan sát.',
        placeFemaleTask: 'Hãy kéo mèo cái lên bàn quan sát và đặt cạnh mèo đực.',
        maleOff: 'Hãy đặt mèo đực vào khu vực quan sát.',
        femaleOff: 'Hãy đặt mèo cái vào khu vực quan sát.',
        identifyTask: 'Hãy xác định mèo đực và mèo cái.',
        identifyWrong: 'Hãy quan sát và xác định đúng mèo đực hoặc mèo cái.',
        cellsTask: 'Hãy đưa tinh trùng vào khu vực MÈO ĐỰC và trứng vào khu vực MÈO CÁI.',
        spermWrong: 'Chưa đúng. Hãy đưa tinh trùng vào khu vực mèo đực.',
        eggWrong: 'Chưa đúng. Hãy đưa trứng vào khu vực mèo cái.',
        fertilizeTask: 'Hãy chọn một tinh trùng và đưa tinh trùng đến gần trứng.',
        eggClick: 'Hãy chọn một tinh trùng để thực hiện quá trình thụ tinh.',
        spermFar: 'Hãy đưa tinh trùng đến trứng.',
        zygoteLensTask: 'Hãy dùng kính phóng đại để quan sát hợp tử.',
        lensZygoteOff: 'Hãy đưa kính đến gần hợp tử để quan sát.',
        lensOff: 'Hãy đưa kính đến gần đối tượng cần quan sát.',
        embryoLensTask: 'Hãy dùng kính phóng đại để quan sát phôi.',
        markLocked: 'Hãy hoàn thành mốc trước để tiếp tục quan sát.',
        kittenTask: 'Hãy nhấp vào mèo con để quan sát.',
        kittenOff: 'Hãy nhấp vào mèo con để quan sát.',
        kittenLensTask: 'Hãy dùng kính phóng đại để quan sát mèo con.',
        sortTask: 'Hãy kéo các thẻ và sắp xếp theo đúng trình tự sinh sản và phát triển của mèo.',
        sortWrong: 'Chưa đúng. Hãy quan sát lại trình tự từ thụ tinh đến khi mèo trưởng thành.',
        phaseDone: 'Em đã hoàn thành giai đoạn này.'
      },
      right: {
        male: 'Đã đặt mèo đực.',
        female: 'Đã đặt mèo cái.',
        bothPlaced: 'Đã đặt mèo cái. Hai con mèo đã được đặt đúng vị trí.',
        intro: 'Trong sinh sản, mèo đực tạo ra tế bào sinh dục đực, còn mèo cái tạo ra tế bào sinh dục cái.',
        maleId: 'Mèo đực tạo ra tế bào sinh dục đực.',
        femaleId: 'Mèo cái tạo ra tế bào sinh dục cái.',
        spermInfo: 'Mèo đực tạo ra tinh trùng.',
        eggInfo: 'Mèo cái tạo ra trứng.',
        spermPlaced: 'Đúng! Đây là tế bào sinh dục đực.',
        eggPlaced: 'Đúng! Đây là tế bào sinh dục cái.',
        fertilized: 'Thụ tinh là sự kết hợp giữa tế bào sinh dục đực và tế bào sinh dục cái.',
        zygote: 'Sau khi thụ tinh, hợp tử được hình thành.',
        kittenBorn: 'Sau khi thai phát triển đầy đủ trong cơ thể mèo mẹ, mèo con được sinh ra.',
        kittenLens: 'Mèo con mới sinh có kích thước nhỏ và khả năng vận động còn yếu.',
        fetusPart: 'Các bộ phận cơ thể của thai ngày càng phát triển rõ hơn.',
        compareInfo: 'Mèo con 2 tháng tuổi có kích thước lớn hơn và khả năng vận động tốt hơn mèo con mới sinh.',
        compareAll: 'Qua từng giai đoạn, mèo con tăng kích thước và khả năng vận động ngày càng hoàn thiện.',
        adultAll: 'Mèo con tiếp tục lớn lên, cơ thể phát triển hoàn thiện và trở thành mèo trưởng thành.'
      },
      /* the four timelines: the marks (md sections 15, 16, 19, 21) and what each mark shows */
      marks: { embryo: ['Ngày 0', 'Ngày 15', 'Ngày 30', 'Ngày 45'], fetus: ['Ngày 45', 'Ngày 60', 'Gần ngày sinh'], growth: ['1 tuần', '2 tuần', '1 tháng', '2 tháng'], adult: ['2 tháng', '6 tháng', '1 năm'] },
      markInfo: {
        embryo: [
          { msg: 'Hợp tử mới được hình thành.', lines: [] },
          { msg: 'Hợp tử bắt đầu phân chia thành nhiều tế bào.', lines: [] },
          { msg: 'Các tế bào tiếp tục phân chia và phát triển.', lines: [] },
          { msg: 'Hợp tử tiếp tục phát triển thành phôi.', lines: [] }
        ],
        fetus: [
          { msg: 'Cơ thể còn nhỏ.', lines: ['Các cấu trúc bắt đầu rõ.'] },
          { msg: 'Các bộ phận cơ thể rõ hơn.', lines: ['Có thể nhận biết:', 'đầu', 'thân', 'chân', 'tai', 'đuôi'] },
          { msg: 'Phôi tiếp tục phát triển, các bộ phận cơ thể dần hình thành và thai lớn lên trong cơ thể mèo mẹ.', lines: ['Thai lớn hơn.', 'Hình dạng cơ thể rõ hơn.'] }
        ],
        growth: [
          { msg: 'Mèo con bắt đầu lớn lên và vận động nhiều hơn.', lines: ['lớn hơn một chút', 'cử động nhiều hơn', 'vẫn phụ thuộc chủ yếu vào sữa mẹ'] },
          { msg: 'Mèo con bắt đầu mở mắt và tăng khả năng vận động.', lines: ['mắt bắt đầu mở', 'tai rõ hơn', 'bò nhiều hơn', 'bắt đầu đi lại'] },
          { msg: 'Mèo con bắt đầu tập ăn và hoạt động độc lập hơn.', lines: ['cơ thể lớn rõ rệt', 'đi lại tốt hơn', 'chơi', 'bắt đầu tập ăn thức ăn phù hợp'] },
          { msg: 'Mèo con ngày càng lớn và tự lập hơn.', lines: ['cơ thể lớn hơn', 'chạy nhảy tốt hơn', 'ăn thức ăn phù hợp', 'ít phụ thuộc vào sữa mẹ hơn'] }
        ],
        adult: [
          { msg: 'cơ thể còn nhỏ', lines: ['hoạt động nhanh nhẹn', 'có thể tự ăn thức ăn phù hợp'] },
          { msg: 'cơ thể lớn hơn', lines: ['chân phát triển', 'thân phát triển', 'lông phát triển đầy đủ', 'vận động linh hoạt'] },
          { msg: 'cơ thể đạt kích thước gần trưởng thành', lines: ['vận động hoàn thiện', 'có thể tự kiếm ăn', 'có khả năng sinh sản khi trưởng thành'] }
        ]
      },
      /* the parts of the fetus (md 16.2, 16.4) and the regions the glass shows on the newborn kitten (md 18.1) */
      parts: { head: 'đầu', body: 'thân', legs: 'chân', tail: 'đuôi', ears: 'tai' },
      regions: ['Mắt', 'Tai', 'Chân', 'Thân'],
      newborn: ['kích thước nhỏ', 'mắt chưa mở', 'tai nhỏ', 'chân còn yếu', 'vận động hạn chế', 'phụ thuộc vào mèo mẹ', 'bú sữa mẹ'],
      /* sorting the eight cards (md 22) */
      sort: {
        title: 'SẮP XẾP QUÁ TRÌNH SINH SẢN VÀ PHÁT TRIỂN CỦA MÈO',
        cards: ['TINH TRÙNG + TRỨNG', 'THỤ TINH', 'HỢP TỬ', 'PHÔI', 'THAI', 'MÈO CON', 'MÈO CON LỚN DẦN', 'MÈO TRƯỞNG THÀNH'],       // card i belongs to slot i + 1
        right: 'Chính xác! Em đã xác định đúng quá trình sinh sản và các giai đoạn phát triển của mèo.'
      },
      finish: {
        title: 'HOÀN THÀNH THÍ NGHIỆM!',
        line: 'Em đã tìm hiểu được quá trình sinh sản và vòng đời của mèo.',
        conclusionTitle: 'KẾT LUẬN',
        conclusion: 'Mèo sinh sản bằng cách sinh con. Mèo đực tạo ra tinh trùng, mèo cái tạo ra trứng. Khi tinh trùng kết hợp với trứng sẽ xảy ra thụ tinh và hình thành hợp tử. Hợp tử phát triển thành phôi, phôi tiếp tục phát triển thành thai trong cơ thể mèo mẹ. Khi phát triển đầy đủ, mèo con được sinh ra. Sau khi sinh, mèo con lớn dần, kích thước cơ thể tăng lên, khả năng vận động và tự ăn ngày càng hoàn thiện, cuối cùng phát triển thành mèo trưởng thành.',
        end: 'KẾT THÚC THÍ NGHIỆM',
        endTick: 'HOÀN THÀNH ✓',
        endLine: 'Em đã tìm hiểu được sự sinh sản và vòng đời của mèo.'
      }
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 8: ',
      help: [
        'Kéo mèo đực và mèo cái từ khay bên trái lên bàn quan sát, rồi bấm BẮT ĐẦU QUAN SÁT. Nhấp vào từng con mèo để xác định mèo đực và mèo cái.',
        'Nhấp vào tinh trùng và trứng, rồi kéo tinh trùng vào khu vực mèo đực, kéo trứng vào khu vực mèo cái. Ở giai đoạn thụ tinh, kéo một tinh trùng đến gần trứng.',
        'Kéo kính phóng đại đến hợp tử, phôi, thai và mèo con để quan sát. Kính chỉ dùng để nhìn, không làm đổi thí nghiệm.',
        'Ở các thanh thời gian, nhấp hoặc kéo đến mốc tiếp theo. Mốc chưa mở thì bị khóa. Sau mỗi giai đoạn, bấm TIẾP TỤC.',
        'Cuối cùng kéo 8 thẻ vào đúng thứ tự. Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      busy: 'Em chờ một chút nhé.',
      zone: 'BÀN QUAN SÁT',
      maleArea: 'KHU VỰC MÈO ĐỰC',
      femaleArea: 'KHU VỰC MÈO CÁI',
      startTask: 'Bấm nút BẮT ĐẦU QUAN SÁT.',
      startLocked: 'Hãy đặt cả mèo đực và mèo cái lên bàn quan sát trước.',
      zygoteClickTask: 'Hãy nhấp vào hợp tử.',
      markTask: 'Hãy nhấp mốc tiếp theo trên thanh thời gian.',
      fetusPartsTask: 'Hãy nhấp vào đầu, thân, chân và đuôi của thai.',
      fetusLensTask: 'Hãy dùng kính phóng đại để quan sát thai.',
      compareTask: 'Hãy nhấp vào từng mèo con để so sánh.',
      lensEmbryoEarly: 'Hãy theo dõi đến Ngày 45 rồi dùng kính để quan sát phôi.',
      lensFetusEarly: 'Hãy theo dõi đến mốc Gần ngày sinh rồi dùng kính để quan sát thai.',
      kittenFirst: 'Hãy nhấp vào mèo con trước, rồi dùng kính.',
      lensOn: 'Kính phóng đại đang cho em nhìn gần hơn. Nhấp vào kính để cất đi.',
      next: '▶ TIẾP TỤC',
      infoTitle: 'THÔNG TIN QUAN SÁT',
      timeTitle: 'THANH THỜI GIAN',
      stageTitle: 'GIAI ĐOẠN',
      prepTitle: 'CHUẨN BỊ',
      compareInfo: ['Mèo con mới sinh nhỏ và vận động còn yếu.', 'Mèo con 1 tháng tuổi lớn hơn mèo mới sinh và đi lại tốt hơn.'],
      diagramTitle: 'SƠ ĐỒ TỔNG QUÁT',
      reviewNote: 'Đang xem lại. Thí nghiệm giữ nguyên, em không phải làm lại nhiệm vụ nào.',
      reviewBack: 'QUAY LẠI',
      reviewClose: 'XONG',
      cardsTitle: 'THẺ GIAI ĐOẠN',
      slotNumber: 'VỊ TRÍ',
      motherLabel: 'MÈO MẸ'
    }
  };
})(window.Lab);

/* Experiment 8 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp8 = {
    /* `user` overrides the cat wording and aligns the pig life-cycle facts and milestones to the requested scenario. */
    user: {
      title: 'TÌM HIỂU SỰ SINH SẢN VÀ VÒNG ĐỜI CỦA ĐỘNG VẬT ĐẺ CON – HEO',
      steps: ['HEO ĐỰC + HEO CÁI', 'TINH TRÙNG + TRỨNG', 'THỤ TINH', 'HỢP TỬ', 'PHÔI', 'THAI', 'HEO CON', 'HEO CON LỚN DẦN', 'HEO TRƯỞNG THÀNH'],
      stageTitles: ['GIAI ĐOẠN 1: HEO ĐỰC VÀ HEO CÁI', 'GIAI ĐOẠN 2: TINH TRÙNG VÀ TRỨNG', 'GIAI ĐOẠN 3: THỤ TINH', 'GIAI ĐOẠN 4: HỢP TỬ', 'GIAI ĐOẠN 5: HỢP TỬ PHÁT TRIỂN THÀNH PHÔI',
        'GIAI ĐOẠN 6: PHÔI PHÁT TRIỂN THÀNH THAI', 'GIAI ĐOẠN 7: HEO CON', 'GIAI ĐOẠN 8: HEO CON LỚN DẦN', 'GIAI ĐOẠN 9: HEO TRƯỞNG THÀNH'],
      tools: { male: 'HEO ĐỰC', female: 'HEO CÁI' },
      info: { species: ['Loài', 'Heo'] },
      labels: { male: 'HEO ĐỰC', female: 'HEO CÁI', kittenNew: 'HEO CON MỚI SINH', compare: [] },
      msg: {
        placeMaleTask: 'Hãy kéo heo đực vào khu vực quan sát.',
        placeFemaleTask: 'Hãy kéo heo cái lên bàn quan sát và đặt cạnh heo đực.',
        maleOff: 'Hãy đặt heo đực vào khu vực quan sát.',
        femaleOff: 'Hãy đặt heo cái vào khu vực quan sát.',
        identifyTask: 'Hãy xác định heo đực và heo cái.',
        identifyWrong: 'Hãy quan sát và xác định đúng heo đực hoặc heo cái.',
        cellsTask: 'Hãy đưa tinh trùng vào khu vực HEO ĐỰC và trứng vào khu vực HEO CÁI.',
        spermWrong: 'Chưa đúng. Hãy đưa tinh trùng vào khu vực heo đực.',
        eggWrong: 'Chưa đúng. Hãy đưa trứng vào khu vực heo cái.',
        kittenTask: 'Hãy nhấp vào heo con để quan sát.',
        kittenOff: 'Hãy nhấp vào heo con để quan sát.',
        kittenLensTask: 'Hãy dùng kính phóng đại để quan sát heo con.',
        sortTask: 'Hãy kéo các thẻ và sắp xếp theo đúng trình tự sinh sản và phát triển của heo.',
        sortWrong: 'Chưa đúng. Hãy quan sát lại trình tự từ thụ tinh đến khi heo trưởng thành.'
      },
      right: {
        male: 'Đã đặt heo đực.',
        female: 'Đã đặt heo cái.',
        bothPlaced: 'Đã đặt heo cái. Hai con heo đã được đặt đúng vị trí.',
        intro: 'Trong sinh sản, heo đực tạo ra tế bào sinh dục đực, còn heo cái tạo ra tế bào sinh dục cái.',
        maleId: 'Heo đực tạo ra tế bào sinh dục đực (tinh trùng).',
        femaleId: 'Heo cái tạo ra tế bào sinh dục cái (trứng).',
        spermInfo: 'Heo đực tạo ra tinh trùng.',
        eggInfo: 'Heo cái tạo ra trứng.',
        fertilized: 'Thụ tinh đã xảy ra.',
        kittenBorn: 'Khoảng Ngày 114, heo mẹ sinh heo con.',
        kittenLens: 'Heo con mới sinh phụ thuộc hoàn toàn vào mẹ, cần bú sữa non để tăng sức đề kháng.',
        fetusPart: '',
        compareInfo: '',
        compareAll: '',
        adultAll: 'Heo con tiếp tục lớn lên, cơ thể và cơ quan sinh dục phát triển, rồi trở thành heo trưởng thành có khả năng sinh sản.'
      },
      marks: { embryo: ['Ngày 0', 'Ngày 21', 'Ngày 28', 'Ngày 35'], fetus: ['Ngày 45', 'Ngày 70', 'Ngày 90', 'Ngày 110'] },
      markInfo: {
        embryo: [
          { msg: 'Hợp tử còn rất nhỏ và đang phân chia.', lines: [] },
          { msg: 'Đến Ngày 21, phôi tiếp tục phát triển và làm tổ trong tử cung.', lines: ['Phôi bám vào niêm mạc tử cung.'] },
          { msg: 'Đến Ngày 28, phôi tiếp tục phát triển trong tử cung.', lines: [] },
          { msg: 'Đến khoảng Ngày 35, phôi đã phát triển rõ hơn.', lines: ['Khi dùng kính phóng đại, em sẽ thấy hình ảnh hợp tử phát triển thành phôi lớn dần.'] }
        ],
        fetus: [
          { msg: 'Thai còn nhỏ, hình dáng heo con bắt đầu rõ hơn.', lines: ['Giai đoạn giữa thai kỳ: Ngày 36–85.'] },
          { msg: 'Heo con trong bụng mẹ tiếp tục lớn lên.', lines: ['Giai đoạn giữa thai kỳ.'] },
          { msg: 'Trong giai đoạn cuối thai kỳ (Ngày 86–114), heo con lớn nhanh.', lines: [] },
          { msg: 'Đến Ngày 110, hình dáng heo con đã rõ hơn và gần đến ngày sinh.', lines: ['Khoảng Ngày 114, heo mẹ sinh heo con.'] }
        ],
        growth: [
          { msg: 'Heo con một tuần tuổi bú mẹ là chủ yếu và vận động còn vụng về.', lines: ['Cơ thể bắt đầu lớn lên.', 'Vận động còn chưa vững.'] },
          { msg: 'Heo con hai tuần tuổi mở mắt rõ hơn và đi lại vững hơn.', lines: ['Bắt đầu tò mò với môi trường xung quanh.', 'Vẫn bú sữa mẹ.'] },
          { msg: 'Khoảng một tháng tuổi, heo con bắt đầu tập ăn thức ăn khác ngoài sữa mẹ.', lines: ['Cơ thể lớn rõ rệt.', 'Tiếp tục bú mẹ và tập ăn.'] },
          { msg: 'Khoảng hai tháng tuổi, heo con có thể cai sữa và tự ăn.', lines: ['Vận động linh hoạt hơn.', 'Ít phụ thuộc vào heo mẹ.'] }
        ],
        adult: [
          { msg: 'Heo khoảng hai tháng tuổi vẫn tiếp tục lớn lên.', lines: ['Cơ thể còn nhỏ hơn heo trưởng thành.', 'Có thể tự ăn.'] },
          { msg: 'Khoảng sáu tháng tuổi, heo phát triển gần bằng heo trưởng thành về hình dạng khung xương.', lines: ['Cơ quan sinh dục bắt đầu phát triển.', 'Khả năng sinh sản tùy giống và điều kiện nuôi.'] },
          { msg: 'Khoảng một năm tuổi, heo đạt mức trưởng thành sinh dục và thể chất.', lines: ['Heo đực tạo tinh trùng.', 'Heo cái có thể mang thai.'] }
        ]
      },
      newborn: ['kích thước nhỏ', 'thân ướt, da còn mỏng', 'mắt chưa mở hoàn toàn', 'tai nhỏ', 'chân còn yếu', 'vận động còn yếu', 'phụ thuộc vào heo mẹ', 'cần bú sữa non'],
      sort: {
        title: 'SẮP XẾP QUÁ TRÌNH SINH SẢN VÀ PHÁT TRIỂN CỦA HEO',
        cards: ['TINH TRÙNG + TRỨNG', 'THỤ TINH', 'HỢP TỬ', 'PHÔI', 'THAI', 'HEO CON', 'HEO CON LỚN DẦN', 'HEO TRƯỞNG THÀNH'],
        right: 'Chính xác! Em đã xác định đúng quá trình sinh sản và các giai đoạn phát triển của heo.'
      },
      finish: {
        line: 'Em đã tìm hiểu được quá trình sinh sản và vòng đời của heo.',
        conclusion: 'Heo sinh sản bằng hình thức đẻ con. Heo đực tạo tinh trùng, heo cái tạo trứng. Thụ tinh hình thành hợp tử; hợp tử phát triển thành phôi rồi thành thai trong bụng heo mẹ. Sau khoảng 114 ngày mang thai, heo mẹ sinh heo con. Heo con lớn dần về kích thước, khả năng vận động và tự ăn uống, rồi trở thành heo trưởng thành có khả năng sinh sản.',
        endLine: 'Em đã tìm hiểu được sự sinh sản và vòng đời của heo.'
      }
    },

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
        compare: [], embryo: 'PHÔI'
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
      parts: {},
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
        'Kéo heo đực và heo cái từ khay bên trái lên bàn quan sát, rồi bấm BẮT ĐẦU QUAN SÁT. Nhấp vào từng con heo để xác định heo đực và heo cái.',
        'Nhấp vào tinh trùng và trứng, rồi kéo tinh trùng vào khu vực heo đực, kéo trứng vào khu vực heo cái. Ở giai đoạn thụ tinh, kéo một tinh trùng đến gần trứng.',
        'Kéo kính phóng đại đến hợp tử, phôi, thai và heo con để quan sát. Kính chỉ dùng để nhìn, không làm đổi thí nghiệm.',
        'Ở các thanh thời gian, nhấp hoặc kéo đến mốc tiếp theo. Mốc chưa mở thì bị khóa. Sau mỗi giai đoạn, bấm TIẾP TỤC.',
        'Cuối cùng kéo 8 thẻ vào đúng thứ tự. Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.'
      ],
      busy: 'Em chờ một chút nhé.',
      zone: 'BÀN QUAN SÁT',
      maleArea: 'KHU VỰC HEO ĐỰC',
      femaleArea: 'KHU VỰC HEO CÁI',
      startTask: 'Bấm nút BẮT ĐẦU QUAN SÁT.',
      startLocked: 'Hãy đặt cả heo đực và heo cái lên bàn quan sát trước.',
      zygoteClickTask: 'Hãy nhấp vào hợp tử.',
      markTask: 'Hãy nhấp mốc tiếp theo trên thanh thời gian.',
      fetusLensTask: 'Hãy dùng kính phóng đại để quan sát heo con trong bụng mẹ.',
      lensEmbryoEarly: 'Hãy theo dõi đến Ngày 35 rồi dùng kính để quan sát phôi.',
      lensFetusEarly: 'Hãy theo dõi đến Ngày 110 rồi dùng kính để quan sát thai.',
      kittenFirst: 'Hãy nhấp vào heo con trước, rồi dùng kính.',
      lensOn: 'Kính phóng đại đang cho em nhìn gần hơn. Nhấp vào kính để cất đi.',
      next: '▶ TIẾP TỤC',
      infoTitle: 'THÔNG TIN QUAN SÁT',
      timeTitle: 'THANH THỜI GIAN',
      stageTitle: 'GIAI ĐOẠN',
      prepTitle: 'CHUẨN BỊ',
      diagramTitle: 'SƠ ĐỒ TỔNG QUÁT',
      reviewNote: 'Đang xem lại. Thí nghiệm giữ nguyên, em không phải làm lại nhiệm vụ nào.',
      reviewBack: 'QUAY LẠI',
      reviewClose: 'XONG',
      cardsTitle: 'THẺ GIAI ĐOẠN',
      slotNumber: 'VỊ TRÍ',
    }
  };
})(window.Lab);

/* Experiment 3 – all Vietnamese wording.
   • `md`  = copied word for word from "THÍ NGHIỆM 1909.md" (a test checks this, so typos cannot slip in).
   • `app` = short helper messages the md does not specify (marked so you can find and edit them).
   You can edit any text here without touching the program logic. */
(function (Lab) {
  'use strict';
  Lab.content.exp3 = {
    md: {
      title: 'TÌM HIỂU 5 YẾU TỐ CẦN THIẾT CHO SỰ SỐNG CỦA ĐỘNG VẬT',
      steps: ['CHUẨN BỊ', 'THIẾT LẬP MÔI TRƯỜNG', 'BẮT ĐẦU QUAN SÁT', 'KẾT QUẢ'],
      tray: {
        cage1: 'Chuồng 1', cage2: 'Chuồng 2', chickA: 'Gà con A', chickB: 'Gà con B',
        lid: 'Nắp chuồng', food: 'Khay thức ăn', water: 'Bát nước', lamp: 'Đèn chiếu sáng'
      },
      /* what the student is told when a drop is wrong (md sections 8, 12, 13, 18–21, 40, 54) */
      msg: {
        placeCages: 'Hãy đặt hai chuồng nuôi lên bàn thí nghiệm.',
        placeChicks: 'Đã đặt đủ hai chuồng. Hãy đặt gà con vào đúng chuồng.',
        chickWrong: 'Hãy đặt gà con vào đúng chuồng.',
        food: 'Hãy đặt khay thức ăn vào chuồng 2.',
        water: 'Hãy đặt bát nước vào chuồng 2.',
        lamp: 'Hãy đặt đèn vào chuồng 2.',
        lid: 'Hãy đặt nắp đúng vào chuồng 2.',
        lidOnly2: 'Nắp chỉ được sử dụng cho chuồng 2.',
        cage1Fixed: 'Chuồng 1 luôn được giữ đủ 5 yếu tố để làm điều kiện so sánh.',
        fixedTemp: 'Nhiệt độ chuồng 1 được giữ cố định ở 37°C.'
      },
      /* what the student is told when a drop is right (md sections 13, 21, 53) */
      ok: {
        chicksPlaced: 'Đã đặt đúng hai gà con. Hãy thiết lập môi trường cho chuồng 2.',
        water: 'Đúng! Gà đã có nước uống.',
        lid: 'Chuồng đã được đậy kín và trao đổi khí bị hạn chế.'
      },
      startButton: 'BẮT ĐẦU QUAN SÁT',
      confirm: { text: 'Em đã hoàn thành thiết lập môi trường. Bắt đầu quan sát trong 7 ngày?', ok: 'BẮT ĐẦU', cancel: 'HỦY' },
      thermoTitle: 'BẢNG ĐIỀU KHIỂN NHIỆT ĐỘ',
      days: ['NGÀY 1', 'NGÀY 2', 'NGÀY 3', 'NGÀY 4', 'NGÀY 5', 'NGÀY 6', 'NGÀY 7'],
      after: 'KẾT QUẢ THÍ NGHIỆM',
      placard: { 1: 'CHUỒNG 1 – ĐỦ 5 YẾU TỐ', 2: 'CHUỒNG 2 – EM TỰ THIẾT LẬP' },
      role: { 1: 'ĐIỀU KIỆN ĐỐI CHỨNG – LUÔN ĐỦ 5 YẾU TỐ', 2: 'ĐIỀU KIỆN THÍ NGHIỆM – HỌC SINH TỰ THIẾT LẬP' },
      cageName: { 1: 'CHUỒNG 1', 2: 'CHUỒNG 2' },
      help: [
        'Em hãy đặt hai chuồng lên bàn, đưa gà vào đúng chuồng, sau đó thiết lập môi trường sống cho gà con B.',
        'Em có thể chọn những yếu tố muốn có hoặc không có trong chuồng 2.',
        'Cuối cùng nhấn “Bắt đầu quan sát” để xem kết quả sau 7 ngày.'
      ],
      factor: { food: 'Thức ăn', water: 'Nước', oxygen: 'O₂', light: 'Ánh sáng', temperature: 'Nhiệt độ' },
      /* Có / Thiếu (index 0 = have, 1 = lack) */
      status: {
        food: ['Có thức ăn', 'Thiếu thức ăn'], water: ['Có nước', 'Thiếu nước'],
        oxygen: ['Có O₂', 'Thiếu O₂'], light: ['Có ánh sáng', 'Thiếu ánh sáng']
      },
      info: {
        head: ['Thông tin', 'Gà con A', 'Gà con B'],
        rows: [
          ['Độ tuổi', '7 ngày tuổi', '7 ngày tuổi'],
          ['Cân nặng', '65g', '65g'],
          ['Giới tính', 'Đực', 'Đực'],
          ['Màu lông', 'Vàng', 'Vàng'],
          ['Giống loài', 'Gà Ri', 'Gà Ri'],
          ['Tình trạng sức khỏe', 'Khỏe mạnh; phát triển đồng đều', 'Khỏe mạnh; phát triển đồng đều']
        ]
      },
      /* cage 1 – the control (md sections 25, 36, 37) */
      cage1: {
        quick: ['Gà khỏe.', 'Ăn.', 'Uống.', 'Hoạt động.', 'Tăng trưởng.'],
        behaviors: ['Chạy nhảy.', 'Mổ cám.', 'Uống nước.', 'Đi lại.', 'Kêu “chiếp chiếp”.', 'Nghỉ/ngủ bình thường.'],
        after: ['Lớn nhanh.', 'Mọc thêm lông cánh.', 'Hoạt động bình thường.', 'Phát triển khỏe mạnh.'],
        weight: '65g → 75g',
        status: 'ĐỦ 5 YẾU TỐ'
      },
      compare: {
        head: ['Yếu tố', 'Chuồng 1', 'Chuồng 2'],
        rows: { food: 'Thức ăn', water: 'Nước', oxygen: 'O₂', light: 'Ánh sáng', temperature: 'Nhiệt độ', result: 'Kết quả' },
        yes: 'Có', lack: 'Thiếu', temp1: '37°C', healthy: 'Phát triển khỏe mạnh'
      },
      analysis: {
        title: 'EM ĐÃ THIẾT LẬP CHUỒNG 2 NHƯ THẾ NÀO?',
        head: ['Yếu tố', 'Trạng thái', 'Ảnh hưởng'],
        after: 'KẾT QUẢ SAU 7 NGÀY',
        yes: 'Có', lack: 'Thiếu',
        /* the "Ảnh hưởng" column (md sections 33 and 50) */
        effect: {
          food: { have: 'Gà ăn bình thường.', lack: 'Thiếu dinh dưỡng, suy kiệt' },
          water: { have: 'Gà uống nước bình thường.', lack: 'Mất nước, suy yếu' },
          oxygen: { have: 'Gà thở bình thường.', lack: 'Khó thở, suy yếu' },
          light: { have: 'Hoạt động bình thường hơn', lack: 'Giảm hoạt động' }
        },
        stillHave: { food: 'Gà vẫn có thức ăn.', water: 'Gà vẫn có nước.' },
        goodTemp: 'Trong khoảng thích hợp'
      },
      /* what the chick does and what it leads to, one block per missing factor (md sections 27–33) */
      obs: {
        food: {
          title: 'Thiếu thức ăn',
          chick: ['Liên tục mổ xuống sàn tìm thức ăn.', 'Đi lại tìm kiếm.', 'Sau một thời gian giảm hoạt động.', 'Yếu dần.', 'Không phát triển bình thường nếu thiếu kéo dài.'],
          result: 'Tìm thức ăn → yếu → suy kiệt nếu kéo dài.'
        },
        water: {
          title: 'Thiếu nước',
          chick: ['Tìm kiếm nước.', 'Kêu nhiều.', 'Giảm hoạt động.', 'Trở nên lờ đờ.'],
          long: 'Gà bị mất nước, suy yếu và ảnh hưởng đến sự sống.',
          result: 'Tìm nước → mất nước → yếu → có thể chết nếu kéo dài.'
        },
        oxygen: {
          title: 'Thiếu O₂',
          env: ['Thành kính mờ.', 'Có hơi nước ngưng tụ.', 'Không gian trở nên bí hơn.'],
          chick: ['Thở nhanh.', 'Há mỏ.', 'Vươn cổ.', 'Giảm hoạt động.', 'Dần suy yếu nếu tình trạng kéo dài.'],
          result: 'Khó thở → yếu → có thể chết nếu thiếu kéo dài.'
        },
        light: {
          title: 'Thiếu ánh sáng',
          env: ['Chuồng tối hơn.', 'Ánh sáng tổng thể giảm.'],
          chick: ['Giảm hoạt động.', 'Ít đi lại.', 'Ít tìm kiếm thức ăn/nước hơn.', 'Sinh hoạt kém bình thường.'],
          result: 'Giảm hoạt động và ảnh hưởng đến sinh hoạt/phát triển.',
          message: 'Ánh sáng là một yếu tố cần thiết cho hoạt động và sinh hoạt bình thường của gà.'
        }
      },
      /* md section 32 – the temperature table, word for word */
      temp: {
        cold: { range: '0–27°C', result: 'Không sống được sau 7 ngày', look: 'Run mạnh → co cụm → lờ đờ → suy yếu → chết' },
        cool: { range: '28–31°C', result: 'Sống nhưng hoạt động không bình thường', look: 'Run nhẹ, co cụm, xù lông, hoạt động giảm' },
        ideal: { range: '32–35°C', result: 'Sống khỏe', look: 'Hoạt động, ăn uống, ngủ nghỉ và phát triển bình thường' },
        warm: { range: '36–39°C', result: 'Sống nhưng hoạt động không bình thường', look: 'Há mỏ, thở nhanh, xòe cánh, tìm nơi mát, giảm hoạt động' },
        hot: { range: '40–60°C', result: 'Không sống được sau 7 ngày', look: 'Thở gấp → lờ đờ → suy yếu → chết' }
      },
      /* several causes at once (md sections 35 and 50) */
      combo: {
        dead: 'Sau 7 ngày, gà suy yếu nghiêm trọng và không sống được do môi trường thiếu nhiều yếu tố cần thiết.',
        lead: 'Gà đồng thời thiếu',
        tail: 'Các yếu tố này cùng ảnh hưởng đến hoạt động và sự sống của gà.'
      },
      conclusion: 'Để sống và phát triển, động vật cần thức ăn, nước, không khí, ánh sáng và nhiệt độ thích hợp. Khi một hoặc nhiều yếu tố cần thiết bị thiếu hoặc không phù hợp trong thời gian dài, hoạt động và sự phát triển của động vật sẽ bị ảnh hưởng, thậm chí có thể không sống được.',
      keywords: 'THỨC ĂN – NƯỚC – KHÔNG KHÍ – ÁNH SÁNG – NHIỆT ĐỘ THÍCH HỢP',
      done: {
        title: 'THÍ NGHIỆM HOÀN THÀNH!',
        sub: '5 YẾU TỐ CẦN THIẾT CHO SỰ SỐNG CỦA ĐỘNG VẬT',
        items: ['Thức ăn', 'Nước', 'Không khí', 'Ánh sáng', 'Nhiệt độ thích hợp'],
        conclusion: 'Động vật cần thức ăn, nước, không khí, ánh sáng và nhiệt độ thích hợp để sống và phát triển. Khi thiếu một hoặc nhiều yếu tố cần thiết trong thời gian dài, hoạt động và sự phát triển của động vật sẽ bị ảnh hưởng, thậm chí có thể không sống được.'
      }
    },

    app: {
      titlePrefix: 'THÍ NGHIỆM 3: ',
      helpReset: 'Bấm LÀM LẠI THÍ NGHIỆM bất cứ lúc nào để chơi lại từ đầu.',
      cageOne: 'Đã đặt chuồng 1. Em hãy đặt nốt chuồng 2 nhé.',
      cageTwo: 'Đã đặt chuồng 2. Em hãy đặt nốt chuồng 1 nhé.',
      chickAOnly: 'Gà con A đã vào chuồng 1. Em hãy đặt gà con B vào chuồng 2 nhé.',
      chickBOnly: 'Gà con B đã vào chuồng 2. Em hãy đặt gà con A vào chuồng 1 nhé.',
      foodOk: 'Đúng! Gà đã có thức ăn.',
      lampOk: 'Đúng! Chuồng 2 đã có ánh sáng.',
      lidOpened: 'Đã mở nắp chuồng 2.',
      lidHint: 'Nhấp vào nắp để mở lại.',
      compareTitle: 'So sánh',
      analysisTitle: 'Phân tích',
      doneTitle: 'Hoàn thành',
      weightLabel: 'Cân nặng',
      chickLabel: 'Gà con',
      behaviorLabel: 'Hành vi',
      resultLabel: 'Kết quả',
      missingLabel: 'Đang thiếu',
      nothingMissing: 'Không thiếu yếu tố nào',
      tempLabel: 'Nhiệt độ',
      /* the words joined into "Gà đồng thời thiếu … . Các yếu tố này …" */
      factorNames: { food: 'thức ăn', water: 'nước', oxygen: 'O₂', light: 'ánh sáng', cold: 'nhiệt độ thích hợp', cool: 'nhiệt độ thích hợp', warm: 'nhiệt độ thích hợp', hot: 'nhiệt độ thích hợp' },
      and: 'và',
      /* how cage 2 ended, by level */
      levelText: {
        weak: 'Gà yếu dần, không phát triển bình thường',
        dying: 'Gà suy yếu, ảnh hưởng đến sự sống'
      },
      icons: ['🍚', '💧', '🌬️', '☀️', '🌡️'],
      tapChick: 'Nhấp vào gà con để xem thông tin'
    }
  };
})(window.Lab);

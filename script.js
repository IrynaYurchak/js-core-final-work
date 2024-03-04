
$(function () {
  let time = 61;
  let chose = 1;
  let isTimerStarted = false;
  let intervalID;
  let targetTime;

  // Налаштування сортування пазлів
  $(".puzzle-box").sortable({
    connectWith: ".puzzle-box",
    containment: ".puzzle-game",
    cursor: "move",
    scroll: false,
    delay: 300,
    start: function (event, ui) {
      if (time == 61) {
        $(".start").trigger("click");
      }
    },
    receive: function (event, ui) {
      if ($(this).attr("value") == "fill") {
        chose = 1;
      } else {
        $(this).attr("value", "fill");
        chose = 0;
      }
    },
    stop: function (event, ui) {
      if (chose) {
        $(this).sortable("cancel");
      } else {
        $(this).removeAttr("value");
      }
      if (gameCheck() === 16) {
        modalOpen(3);
        clearInterval(intervalID);
        isTimerStarted = false;
        $(".countTimer").text("01:00");
        $(".result").attr("disabled", true);
        $(".start").removeAttr("disabled");
        $(".start").css('backgroundColor', '#f52525');
        puzzleFill();

      }
    },
  });

  puzzleFill();
  $(".start").click(function () {
    if (!isTimerStarted) {
      startTimer();
    }
    $(".result").css('backgroundColor', '#f52525');
  });

  $(".result").click(function () {
    modalOpen(1);
  });

  $(".new").click(function () {
    clearInterval(intervalID);
    isTimerStarted = false;
    $(".countTimer").text("01:00");
    $(".start").removeAttr("disabled");
    $(".start").css('backgroundColor', '#f52525');
    $(".result").attr("disabled", true);
    puzzleFill();
  });
  $(".closeSure").click(function () {
    timer = setInterval(startTimer, 1000);
    modalClose(1);
  });

  $(".check").click(function () {
    if (gameCheck() === 16) {
      modalChange(1); // Виграш
    } else {
      modalChange(0); // Програш
    }
  });

  $(".closeLose").click(function () { modalClose(2); });
  $(".closeWin").click(function () { modalClose(3); });

  function puzzleFill() {
    let check = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let position;
    for (let i = 0; i < 16; i++) {
      $(".game-start>.puzzle-box").attr("value", "fill");
      $(".game-end>.puzzle-box").removeAttr("value");
      do {
        position = Math.round(Math.random() * 15);
      } while (check[position]);
      $(`.pzl:eq(${i})`).attr("value", `${position + 1}`);
      $(`.game-start>.puzzle-box:eq(${i})`).append($(`.pzl:eq(${i})`));
      check[position] = 1;
    }
    $(".pzl").css("background-image", "url(img/istockphoto.jpg)");
  }

  function startTimer() {
    if (!isTimerStarted) {
      isTimerStarted = true;
      targetTime = new Date();
      targetTime.setMinutes(targetTime.getMinutes() + 1);
      targetTime.setSeconds(targetTime.getSeconds() + 1);

      intervalID = setInterval(function () {
        const now = new Date();
        let diff = targetTime.getTime() - now.getTime();

        $('.start').prop('disabled', true).css('backgroundColor', '#f5b2b2');
        $('.result').css('backgroundColor', '#f52525').prop('disabled', false);

        if (diff < 0) {
          clearInterval(intervalID);
          isTimerStarted = false;
          $(".countTimer").text("00:00");
          $('.result').prop('disabled', true).css('backgroundColor', '#f5b2b2');
          if (gameCheck() === 16) {
            modalOpen(3);
          } else {
            modalOpen(2);
          }
        } else {
          let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((diff % (1000 * 60)) / 1000);
          minutes = minutes < 10 ? '0' + minutes : minutes;
          seconds = seconds < 10 ? '0' + seconds : seconds;
          $('.countTimer').html(`${minutes}:${seconds}`);
          $('.modal-time').html(` ${minutes}:${seconds}`);
        }
      }, 1000);
    }
  }

  function gameCheck() {
    let checkResult = 0;
    $(".game-end > .puzzle-box > .pzl").each(function (index) {
      if (parseInt($(this).attr("value")) === index + 1) {
        checkResult++;
      }
    });
    return checkResult;
  }

  function modalOpen(num) {
    $(".modal").fadeIn(300);
    let alert = "";
    if (num === 1) {
      alert = ".modal-sure";
    } else if (num === 2) {
      alert = ".modal-lose";
    } else {
      alert = ".modal-win";
    }
    $(alert).fadeIn(300).css("margin-top", "50px");
  }

  function modalChange(num) {
    $(".modal-sure").hide();
    let alert;
    if (num) {
      alert = ".modal-win";
    } else {
      alert = ".modal-lose";
    }
    $(alert).fadeIn(300).css("margin-top", "50px");
  }

  function modalClose(num) {
    let alert = "";
    if (num === 1) {
      alert = ".modal-sure";
    } else if (num === 2) {
      alert = ".modal-lose";
    } else {
      alert = ".modal-win";
    }
    $(alert).fadeOut(300);
    $(".modal").fadeOut(300);
  }
  $('.start').click(startTimer);

});

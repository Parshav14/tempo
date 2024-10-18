(function ($) {
  ("use strict");

  // Loader
  $(".loader-wrapper").fadeOut("slow", function () {
    $(this).remove();
  });

  // Tap top
  $(".tap-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });

  // Show/hide tap-top button
  $(window).on("scroll", function () {
    $(this).scrollTop() > 600
      ? $(".tap-top").fadeIn()
      : $(".tap-top").fadeOut();
  });

  // Outside click handler
  $(document).on("click", function (e) {
    var outside_space = $(".outside");
    if (
      !outside_space.is(e.target) &&
      outside_space.has(e.target).length === 0
    ) {
      $(".menu-to-be-close").removeClass("d-block").hide();
    }
  });

  // Product details close
  $(".prooduct-details-box .close").on("click", function (e) {
    $(this).closest('[class*=" col-"]').addClass("d-none");
  });

  // Horizontal wrapper hover
  if ($(".page-wrapper").hasClass("horizontal-wrapper")) {
    $(".sidebar-list").hover(
      function () {
        $(this).addClass("hoverd");
      },
      function () {
        $(this).removeClass("hoverd");
      }
    );
    $(window).on("scroll", function () {
      if ($(this).scrollTop() < 600) {
        $(".sidebar-list").removeClass("hoverd");
      }
    });
  }

  // Password show/hide
  $(".show-hide").show();
  $(".show-hide span").addClass("show");
  $(".show-hide span").on("click", function () {
    if ($(this).hasClass("show")) {
      $('input[name="login[password]"]').attr("type", "text");
      $(this).removeClass("show");
    } else {
      $('input[name="login[password]"]').attr("type", "password");
      $(this).addClass("show");
    }
  });
  $('form button[type="submit"]').on("click", function () {
    $(".show-hide span").addClass("show");
    $(".show-hide")
      .parent()
      .find('input[name="login[password]"]')
      .attr("type", "password");
  });

  // Background Image handling
  $(".bg-center").parent().addClass("b-center");
  $(".bg-img-cover").parent().addClass("bg-size");
  $(".bg-img-cover").each(function () {
    var el = $(this),
      src = el.attr("src"),
      parent = el.parent();
    parent.css({
      "background-image": "url(" + src + ")",
      "background-size": "cover",
      "background-position": "center",
      display: "block",
    });
    el.hide();
  });

  // Menu and search toggles
  $(".mega-menu-container").hide();
  $(".header-search").on("click", function () {
    $(".search-full").addClass("open");
  });
  $(".close-search").on("click", function () {
    $(".search-full").removeClass("open");
    $("body").removeClass("offcanvas");
  });
  $(".mobile-toggle").on("click", function () {
    $(".nav-menus").toggleClass("open");
  });
  $(".mobile-toggle-left").on("click", function () {
    $(".left-header").toggleClass("open");
  });
  $(".bookmark-search").on("click", function () {
    $(".form-control-search").toggleClass("open");
  });
  $(".filter-toggle").on("click", function () {
    $(".product-sidebar").toggleClass("open");
  });
  $(".toggle-data").on("click", function () {
    $(".product-wrapper").toggleClass("sidebaron");
  });
  $(".mobile-search").on("click", function () {
    $(".form-control").toggleClass("open");
  });

  // Search functionality
  $(".form-control-search input").keyup(function (e) {
    e.target.value
      ? $(".page-wrapper").addClass("offcanvas-bookmark")
      : $(".page-wrapper").removeClass("offcanvas-bookmark");
  });
  $(".search-full input").keyup(function (e) {
    e.target.value
      ? $("body").addClass("offcanvas")
      : $("body").removeClass("offcanvas");
  });

  // Escape key handler
  $("body").keydown(function (e) {
    if (e.keyCode == 27) {
      $(".search-full input").val("");
      $(".form-control-search input").val("");
      $(".page-wrapper").removeClass("offcanvas-bookmark");
      $(".search-full").removeClass("open");
      $(".search-form .form-control-search").removeClass("open");
      $("body").removeClass("offcanvas");
    }
  });

  // Dark mode toggle
  var Cookie = $.cookie("mode_data");
  if (Cookie == "1") {
    $(".mode i").toggleClass("fa-moon-o fa-lightbulb-o");
    $("body").toggleClass("dark-only");
    localStorage.setItem("body", "dark-only");
  }

  $("#dark_mode").on("click", function () {
    $.cookie("mode_data", Cookie == "0" || Cookie == undefined ? "1" : "0", {
      path: "/",
    });
    location.reload();
  });

  // Chat menu toggle
  $(".chat-menu-icons .toogle-bar").on("click", function () {
    $(".chat-menu").toggleClass("show");
  });

  // Mobile title
  $(".mobile-title svg").on("click", function () {
    $(".header-mega").toggleClass("d-block");
  });

  // Dropdown toggle
  $(".onhover-dropdown").on("click", function () {
    $(this).children(".onhover-show-div").toggleClass("active");
  });

  // Search form toggle
  $(".serchbox").on("click", function (e) {
    $(".search-form").toggleClass("open");
    e.preventDefault();
  });

  // Landing menu toggle
  $(".toggle-menu").on("click", function () {
    $(".landing-menu").toggleClass("open");
  });
  $(".menu-back").on("click", function () {
    $(".landing-menu").toggleClass("open");
  });

  // // Sidebar toggle
  // $(".toggle-sidebar").on("click", function () {
  //   $(".page-wrapper").toggleClass("sidebar-closed");
  //   $(".page-header").toggleClass("close_icon");
  //   $(".sidebar-wrapper").toggleClass("close_icon");
  // });

  // Color selector
  $(".color-selector ul li").on("click", function (e) {
    $(".color-selector ul li").removeClass("active");
    $(this).addClass("active");
  });

  // Ripple effect
  (function ($, window, document, undefined) {
    "use strict";
    var $ripple = $(".js-ripple");
    $ripple.on("click.ui.ripple", function (e) {
      var $this = $(this);
      var $offset = $this.parent().offset();
      var $circle = $this.find(".c-ripple__circle");
      var x = e.pageX - $offset.left;
      var y = e.pageY - $offset.top;
      $circle.css({
        top: y + "px",
        left: x + "px",
      });
      $this.addClass("is-active");
    });
    $ripple.on(
      "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
      function (e) {
        $(this).removeClass("is-active");
      }
    );
  })(jQuery, window, document);

  // Language selector
  var tnum = "en";

  $(document).ready(function () {
    if (localStorage.getItem("primary") != null) {
      var primary_val = localStorage.getItem("primary");
      $("#ColorPicker1").val(primary_val);
      var secondary_val = localStorage.getItem("secondary");
      $("#ColorPicker2").val(secondary_val);
    }

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".translate_wrapper").length) {
        $(".translate_wrapper, .more_lang").removeClass("active");
      }
    });

    $(".translate_wrapper .current_lang").on("click", function (e) {
      e.stopPropagation();
      $(this).parent().toggleClass("active");
      $(".more_lang").toggleClass("active");
    });

    translate(tnum);

    $(".more_lang .lang").on("click", function () {
      $(this).addClass("selected").siblings().removeClass("selected");
      $(".more_lang").removeClass("active");

      var lang = $(this).attr("data-value");
      var tnum = lang;
      translate(tnum);

      $(".current_lang .lang-txt").text($(this).text());
      $(".current_lang i").attr("class", $(this).find("i").attr("class"));
    });
  });

  function translate(tnum) {
    $(".lan-1").text(trans[0][tnum]);
    $(".lan-2").text(trans[1][tnum]);
    $(".lan-3").text(trans[2][tnum]);
    $(".lan-4").text(trans[3][tnum]);
    $(".lan-5").text(trans[4][tnum]);
    $(".lan-6").text(trans[5][tnum]);
    $(".lan-7").text(trans[6][tnum]);
    $(".lan-8").text(trans[7][tnum]);
    $(".lan-9").text(trans[8][tnum]);
  }

  // Full screen toggle
  // Function to toggle fullscreen
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // function toggleFullScreen() {
  //   if (
  //     !document.fullscreenElement &&
  //     !document.mozFullScreenElement &&
  //     !document.webkitFullscreenElement &&
  //     !document.msFullscreenElement
  //   ) {
  //     if (document.documentElement.requestFullscreen) {
  //       document.documentElement.requestFullscreen();
  //     } else if (document.documentElement.mozRequestFullScreen) {
  //       document.documentElement.mozRequestFullScreen();
  //     } else if (document.documentElement.webkitRequestFullscreen) {
  //       document.documentElement.webkitRequestFullscreen(
  //         Element.ALLOW_KEYBOARD_INPUT
  //       );
  //     } else if (document.documentElement.msRequestFullscreen) {
  //       document.documentElement.msRequestFullscreen();
  //     }
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen();
  //     } else if (document.webkitExitFullscreen) {
  //       document.webkitExitFullscreen();
  //     } else if (document.msExitFullscreen) {
  //       document.msExitFullscreen();
  //     }
  //   }
  // }

  $(".toggle-full-screen").on("click", function () {
    toggleFullScreen();
  });
})(jQuery);

// (function ($) {
//   "use strict";

//   // Loader
//   $(".loader-wrapper").fadeOut("slow", function () {
//     $(this).remove();
//   });

//   // Tap top button
//   $(".tap-top").on("click", function () {
//     $("html, body").animate(
//       {
//         scrollTop: 0,
//       },
//       600
//     );
//     return false;
//   });

//   // Scroll for showing tap-top
//   $(window).on("scroll", function () {
//     if ($(this).scrollTop() > 600) {
//       $(".tap-top").fadeIn();
//     } else {
//       $(".tap-top").fadeOut();
//     }
//   });

//   // Click outside to close menu
//   $(document).on("click", function (e) {
//     var outside_space = $(".outside");
//     if (
//       !outside_space.is(e.target) &&
//       outside_space.has(e.target).length === 0
//     ) {
//       $(".menu-to-be-close").removeClass("d-block");
//       $(".menu-to-be-close").css("display", "none");
//     }
//   });

//   // Product details box close
//   $(".product-details-box .close").on("click", function (e) {
//     $(this).closest('[class*=" col-"]').addClass("d-none");
//   });

//   // Sidebar hover for horizontal wrapper
//   if ($(".page-wrapper").hasClass("horizontal-wrapper")) {
//     $(".sidebar-list").hover(
//       function () {
//         $(this).addClass("hovered");
//       },
//       function () {
//         $(this).removeClass("hovered");
//       }
//     );
//     $(window).on("scroll", function () {
//       if ($(this).scrollTop() < 600) {
//         $(".sidebar-list").removeClass("hovered");
//       }
//     });
//   }

//   // Password show/hide
//   $(".show-hide").show();
//   $(".show-hide span").addClass("show");
//   $(".show-hide span").on("click", function () {
//     if ($(this).hasClass("show")) {
//       $('input[name="login[password]"]').attr("type", "text");
//       $(this).removeClass("show");
//     } else {
//       $('input[name="login[password]"]').attr("type", "password");
//       $(this).addClass("show");
//     }
//   });

//   // Reset password input to hidden on form submit
//   $('form button[type="submit"]').on("click", function () {
//     $(".show-hide span").addClass("show");
//     $(".show-hide")
//       .parent()
//       .find('input[name="login[password]"]')
//       .attr("type", "password");
//   });

//   // Background Image handling
//   $(".bg-img-cover").each(function () {
//     var el = $(this),
//       src = el.attr("src"),
//       parent = el.parent();
//     parent.css({
//       "background-image": "url(" + src + ")",
//       "background-size": "cover",
//       "background-position": "center",
//       display: "block",
//     });
//     el.hide();
//   });

//   // Search and menu toggles
//   $(".header-search").on("click", function () {
//     $(".search-full").addClass("open");
//   });
//   $(".close-search").on("click", function () {
//     $(".search-full").removeClass("open");
//     $("body").removeClass("offcanvas");
//   });
//   $(".mobile-toggle").on("click", function () {
//     $(".nav-menus").toggleClass("open");
//   });
//   $(".mobile-toggle-left").on("click", function () {
//     $(".left-header").toggleClass("open");
//   });

//   // Form control search
//   $(".form-control-search input").on("keyup", function (e) {
//     if (e.target.value) {
//       $(".page-wrapper").addClass("offcanvas-bookmark");
//     } else {
//       $(".page-wrapper").removeClass("offcanvas-bookmark");
//     }
//   });

//   // Close search with ESC key
//   $("body").on("keydown", function (e) {
//     if (e.keyCode === 27) {
//       $(".search-full input").val("");
//       $(".form-control-search input").val("");
//       $(".page-wrapper").removeClass("offcanvas-bookmark");
//       $(".search-full").removeClass("open");
//       $(".search-form .form-control-search").removeClass("open");
//       $("body").removeClass("offcanvas");
//     }
//   });

//   // Dark mode toggle
//   var Cookie = $.cookie("mode_data");
//   if (Cookie == "1") {
//     $(".mode i").toggleClass("fa-moon-o").toggleClass("fa-lightbulb-o");
//     $("body").toggleClass("dark-only");
//     localStorage.setItem("body", "dark-only");
//   }

//   $("#dark-mode-toggle").on("click", function () {
//     $("body").toggleClass("dark-theme");
//     localStorage.setItem("dark-mode", $("body").hasClass("dark-theme"));
//   });

//   // Check for saved dark mode preference
//   if (localStorage.getItem("dark-mode") === "true") {
//     $("body").addClass("dark-theme");
//   }

//   // Chat menu toggle
//   $(".chat-menu-icons .toggle-bar").on("click", function () {
//     $(".chat-menu").toggleClass("show");
//   });

//   // Toggle for mobile search and sidebar
//   $(".mobile-search").on("click", function () {
//     $(".form-control").toggleClass("open");
//   });

//   // Color selector for themes
//   $(".color-selector ul li").on("click", function (e) {
//     $(".color-selector ul li").removeClass("active");
//     $(this).addClass("active");
//   });

//   // Ripple effect
//   $(".js-ripple")
//     .on("click.ui.ripple", function (e) {
//       var $this = $(this);
//       var $offset = $this.parent().offset();
//       var $circle = $this.find(".c-ripple__circle");
//       var x = e.pageX - $offset.left;
//       var y = e.pageY - $offset.top;
//       $circle.css({
//         top: y + "px",
//         left: x + "px",
//       });
//       $this.addClass("is-active");
//     })
//     .on(
//       "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
//       function () {
//         $(this).removeClass("is-active");
//       }
//     );

//   // Fullscreen toggle
//   function toggleFullScreen() {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   }

// window.toggleFullScreen = function () {
//   if (
//     !document.fullscreenElement &&
//     !document.mozFullScreen &&
//     !document.webkitIsFullScreen
//   ) {
//     if (document.documentElement.requestFullscreen) {
//       document.documentElement.requestFullscreen();
//     } else if (document.documentElement.mozRequestFullScreen) {
//       document.documentElement.mozRequestFullScreen();
//     } else if (document.documentElement.webkitRequestFullscreen) {
//       document.documentElement.webkitRequestFullscreen(
//         Element.ALLOW_KEYBOARD_INPUT
//       );
//     }
//   } else {
//     if (document.cancelFullScreen) {
//       document.cancelFullScreen();
//     } else if (document.mozCancelFullScreen) {
//       document.mozCancelFullScreen();
//     } else if (document.webkitCancelFullScreen) {
//       document.webkitCancelFullScreen();
//     }
//   }
// };
// })(jQuery);

// original

// (function ($) {
//     "use strict";

//     // loader
//     $('.loader-wrapper').fadeOut('slow', function () {
//         $(this).remove();
//     });
//     // tap top
//     $('.tap-top').on('click', function () {
//         $("html, body").animate({
//             scrollTop: 0
//         }, 600);
//         return false;
//     });

//     $(window).on('scroll', function () {
//         if ($(this).scrollTop() > 600) {
//             $('.tap-top').fadeIn();
//         } else {
//             $('.tap-top').fadeOut();
//         }
//     });
//     $(document).on('click', function (e) {
//         var outside_space = $(".outside");
//         if (!outside_space.is(e.target) &&
//             outside_space.has(e.target).length === 0) {
//             $(".menu-to-be-close").removeClass("d-block");
//             $('.menu-to-be-close').css('display', 'none');
//         }
//     })

//     $('.prooduct-details-box .close').on('click', function (e) {
//         var order_details = $(this).closest('[class*=" col-"]').addClass('d-none');
//     })

//     if ($(".page-wrapper").hasClass("horizontal-wrapper")) {
//         $(".sidebar-list").hover(
//           function () {
//             $(this).addClass("hoverd");
//           },
//           function () {
//             $(this).removeClass("hoverd");
//           }
//         );
//         $(window).on("scroll", function () {
//           if ($(this).scrollTop() < 600) {
//             $(".sidebar-list").removeClass("hoverd");
//           }
//         });
//       }

//     /*----------------------------------------
//      passward show hide
//      ----------------------------------------*/
//     $('.show-hide').show();
//     $('.show-hide span').addClass('show');

//     $('.show-hide span').on('click', function () {
//         if ($(this).hasClass('show')) {
//             $('input[name="login[password]"]').attr('type', 'text');
//             $(this).removeClass('show');
//         } else {
//             $('input[name="login[password]"]').attr('type', 'password');
//             $(this).addClass('show');
//         }
//     });
//     $('form button[type="submit"]').on('click', function () {
//         $('.show-hide span').addClass('show');
//         $('.show-hide').parent().find('input[name="login[password]"]').attr('type', 'password');
//     });

//     /*=====================
//       02. Background Image js
//       ==========================*/
//     $(".bg-center").parent().addClass('b-center');
//     $(".bg-img-cover").parent().addClass('bg-size');
//     $('.bg-img-cover').each(function () {
//         var el = $(this),
//             src = el.attr('src'),
//             parent = el.parent();
//         parent.css({
//             'background-image': 'url(' + src + ')',
//             'background-size': 'cover',
//             'background-position': 'center',
//             'display': 'block'
//         });
//         el.hide();
//     });

//     $(".mega-menu-container").css("display", "none");
//     $(".header-search").on('click', function () {
//         $(".search-full").addClass("open");
//     });
//     $(".close-search").on('click', function () {
//         $(".search-full").removeClass("open");
//         $("body").removeClass("offcanvas");
//     });
//     $(".mobile-toggle").on('click', function () {
//         $(".nav-menus").toggleClass("open");
//     });
//     $(".mobile-toggle-left").on('click', function () {
//         $(".left-header").toggleClass("open");
//     });
//     $(".bookmark-search").on('click', function () {
//         $(".form-control-search").toggleClass("open");
//     })
//     $(".filter-toggle").on('click', function () {
//         $(".product-sidebar").toggleClass("open");
//     });
//     $(".toggle-data").on('click', function () {
//         $(".product-wrapper").toggleClass("sidebaron");
//     });

//     $(".mobile-search").on('click', function () {
//         $(".form-control").toggleClass("open");
//     });

//     $(".form-control-search input").keyup(function (e) {
//         if (e.target.value) {
//             $(".page-wrapper").addClass("offcanvas-bookmark");
//         } else {
//             $(".page-wrapper").removeClass("offcanvas-bookmark");
//         }
//     });
//     $(".search-full input").keyup(function (e) {
//         if (e.target.value) {
//             $("body").addClass("offcanvas");
//         } else {
//             $("body").removeClass("offcanvas");
//         }
//     });

//     $('body').keydown(function (e) {
//         if (e.keyCode == 27) {
//             $('.search-full input').val('');
//             $('.form-control-search input').val('');
//             $('.page-wrapper').removeClass('offcanvas-bookmark');
//             $('.search-full').removeClass('open');
//             $('.search-form .form-control-search').removeClass('open');
//             $("body").removeClass("offcanvas");
//         }
//     });

//     var Cookie = $.cookie('mode_data');
//     if (Cookie == '1') {
//         $('.mode i').toggleClass("fa-moon-o").toggleClass("fa-lightbulb-o");
//         $('body').toggleClass("dark-only");
//         var color = $(this).attr("data-attr");
//         localStorage.setItem('body', 'dark-only');
//     }

//     $("#dark_mode").on("click", function () {

//         if (Cookie == '0' || Cookie == undefined) {

//             $.cookie("mode_data", '1', { path: '/' });
//         } else {

//             $.cookie("mode_data", '0', { path: '/' });
//         }
//         location.reload();
//     });

//     // active link

//     $(".chat-menu-icons .toogle-bar").on('click', function () {
//         $(".chat-menu").toggleClass("show");
//     });

//     $(".mobile-title svg").on('click', function (){
//         $(".header-mega").toggleClass("d-block");
//     });

//     $(".onhover-dropdown").on("click", function () {
//         $(this).children('.onhover-show-div').toggleClass("active");
//     });
//     // search input
//     $(".serchbox").on("click", function (e) {
//         $(".search-form").toggleClass("open");
//         e.preventDefault();
//     });

//     //landing header //
//     $(".toggle-menu").on('click', function (){
//         $('.landing-menu').toggleClass('open');
//     });
//     $(".menu-back").on('click', function (){
//         $('.landing-menu').toggleClass('open');
//     });

//     $(".md-sidebar-toggle").on('click', function (){
//         $('.md-sidebar-aside').toggleClass('open');
//     });

//     // color selector
//       $('.color-selector ul li ').on('click', function(e) {
//         $(".color-selector ul li").removeClass("active");
//         $(this).addClass("active");
//       });

//     //extra
//     $(document).ready(function() {
//         // $('body').addClass('box-layout');
//     });

//     (function ($, window, document, undefined) {
//         "use strict";
//         var $ripple = $(".js-ripple");
//         $ripple.on("click.ui.ripple", function (e) {
//             var $this = $(this);
//             var $offset = $this.parent().offset();
//             var $circle = $this.find(".c-ripple__circle");
//             var x = e.pageX - $offset.left;
//             var y = e.pageY - $offset.top;
//             $circle.css({
//                 top: y + "px",
//                 left: x + "px"
//             });
//             $this.addClass("is-active");
//         });
//         $ripple.on(
//             "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
//             function (e) {
//                 $(this).removeClass("is-active");
//             });

//     })(jQuery, window, document);

// // Language
// var tnum = 'en';

// $(document).ready(function () {

//     if (localStorage.getItem("primary") != null) {
//         var primary_val = localStorage.getItem("primary");
//         $("#ColorPicker1").val(primary_val);
//         var secondary_val = localStorage.getItem("secondary");
//         $("#ColorPicker2").val(secondary_val);
//     }

//     $(document).on('click', function (e) {
//         $('.translate_wrapper, .more_lang').removeClass('active');
//     });
//     $('.translate_wrapper .current_lang').on('click', function (e) {
//         e.stopPropagation();
//         $(this).parent().toggleClass('active');

//         setTimeout(function () {
//             $('.more_lang').toggleClass('active');
//         }, 5);
//     });

//     /*TRANSLATE*/
//     translate(tnum);

//     $('.more_lang .lang').on('click', function () {
//         $(this).addClass('selected').siblings().removeClass('selected');
//         $('.more_lang').removeClass('active');

//         var i = $(this).find('i').attr('class');
//         var lang = $(this).attr('data-value');
//         var tnum = lang;
//         translate(tnum);

//         $('.current_lang .lang-txt').text(lang);
//         $('.current_lang i').attr('class', i);

//     });
// });

// function translate(tnum, index) {
//     for(var i=1;i<=9;i++){
//         $('.lan-'+i).text(trans[i-1][tnum]);
//     }
// }

//   // function toggleFullScreen() {
//   //   if (
//   //     (document.fullScreenElement && document.fullScreenElement !== null) ||
//   //     (!document.mozFullScreen && !document.webkitIsFullScreen)
//   //   ) {
//   //     if (document.documentElement.requestFullScreen) {
//   //       document.documentElement.requestFullScreen();
//   //     } else if (document.documentElement.mozRequestFullScreen) {
//   //       document.documentElement.mozRequestFullScreen();
//   //     } else if (document.documentElement.webkitRequestFullScreen) {
//   //       document.documentElement.webkitRequestFullScreen(
//   //         Element.ALLOW_KEYBOARD_INPUT
//   //       );
//   //     }
//   //   } else {
//   //     if (document.cancelFullScreen) {
//   //       document.cancelFullScreen();
//   //     } else if (document.mozCancelFullScreen) {
//   //       document.mozCancelFullScreen();
//   //     } else if (document.webkitCancelFullScreen) {
//   //       document.webkitCancelFullScreen();
//   //     }
//   //   }
//   // }

// })(jQuery);

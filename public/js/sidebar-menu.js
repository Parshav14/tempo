(function ($) {
  ("use strict");

  var page_wrapper = localStorage.getItem("page-wrapper") || "compact-wrapper";

  // Initialize page wrapper class
  $(".page-wrapper").attr("class", "page-wrapper " + page_wrapper);

  // Sidebar toggle for mobile
  $(".toggle-sidebar").on("click", function () {
    // Toggle the class for the sidebar and header
    $(".page-wrapper").toggleClass("sidebar-closed");
    $(".page-header").toggleClass("close_icon");
    $(".sidebar-wrapper").toggleClass("close_icon");

    // Optional: If you have an overlay, you may want to trigger it here
    $(window).trigger("overlay"); // If needed
  });

  // Close sidebar on body click (for mobile)
  $(".body-part").on("click", function () {
    $(".sidebar-wrapper").addClass("close_icon");
    $(".page-header").addClass("close_icon");
  });

  // Function to handle submenu toggling
  function toggleSubmenu(element) {
    var $element = $(element);
    var $parent = $element.parent();
    var $submenu = $element.next(".sidebar-submenu, .menu-content");

    $parent
      .siblings()
      .find(".sidebar-submenu, .menu-content")
      .slideUp("normal");
    $parent.siblings().removeClass("active");
    $parent
      .siblings()
      .find(".according-menu i")
      .removeClass("fa-angle-down")
      .addClass("fa-angle-right");

    if ($submenu.is(":hidden")) {
      $parent.addClass("active");
      $element
        .find(".according-menu i")
        .removeClass("fa-angle-right")
        .addClass("fa-angle-down");
      $submenu.slideDown("normal");
    } else {
      $parent.removeClass("active");
      $element
        .find(".according-menu i")
        .removeClass("fa-angle-down")
        .addClass("fa-angle-right");
      $submenu.slideUp("normal");
    }
  }

  // Setup sidebar menu
  function setupSidebar() {
    $(".sidebar-title").append(
      '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
    );
    $(".sidebar-title").on("click", function () {
      toggleSubmenu(this);
    });

    $(".sidebar-submenu, .menu-content").hide();

    $(".submenu-title").append(
      '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
    );
    $(".submenu-title").on("click", function () {
      toggleSubmenu(this);
    });

    $(".submenu-content").hide();
  }

  // Setup horizontal menu for larger screens
  function setupHorizontalMenu() {
    if (window.matchMedia("(min-width: 1200px)").matches) {
      $("#pageWrapper")
        .removeClass("compact-wrapper")
        .addClass("horizontal-wrapper");
      $(".page-body-wrapper")
        .removeClass("sidebar-icon")
        .addClass("horizontal-menu");
      $(".submenu-title").off("click");
      $(".submenu-content").show();
      $(".sidebar-submenu, .menu-content").show();
    } else {
      $("#pageWrapper")
        .removeClass("horizontal-wrapper")
        .addClass("compact-wrapper");
      $(".page-body-wrapper")
        .removeClass("horizontal-menu")
        .addClass("sidebar-icon");
      setupSidebar();
    }
  }

  // Initial setup based on wrapper class
  if ($("#pageWrapper").hasClass("compact-wrapper")) {
    setupSidebar();
  } else if ($("#pageWrapper").hasClass("horizontal-wrapper")) {
    setupHorizontalMenu();
    $(window).resize(setupHorizontalMenu);
  }

  // Responsive sidebar
  function responsiveSidebar() {
    var windowWidth = $(window).width();
    if (windowWidth <= 1184) {
      $(".sidebar-wrapper").addClass("close_icon");
      $(".page-header").addClass("close_icon");
    } else {
      $(".sidebar-wrapper").removeClass("close_icon");
      $(".page-header").removeClass("close_icon");
    }
  }

  $(window).resize(responsiveSidebar);
  responsiveSidebar();

  // Active menu item
  var current = window.location.pathname;
  $(".sidebar-wrapper nav ul>li a").filter(function () {
    var link = $(this).attr("href");
    if (link && current.indexOf(link) !== -1) {
      $(this).parents().addClass("active");
      $(this).parents().parents("ul").css("display", "block");
      $(this).addClass("active");
      $(this)
        .parent()
        .parent()
        .parent()
        .children("a")
        .find("div.according-menu i")
        .removeClass("fa-angle-right")
        .addClass("fa-angle-down");
      return false;
    }
  });

  // Scroll to active menu item
  if ($("#sidebar-menu .simplebar-content-wrapper a.active").length) {
    $("#sidebar-menu .simplebar-content-wrapper").animate(
      {
        scrollTop:
          $("#sidebar-menu .simplebar-content-wrapper a.active").offset().top -
          200,
      },
      1000
    );
  }

  // Left header mega menu and level menu toggle
  $(".left-header .mega-menu .nav-link").on("click", function (event) {
    event.stopPropagation();
    $(this).parent().children(".mega-menu-container").toggleClass("show");
  });

  $(".left-header .level-menu .nav-link").on("click", function (event) {
    event.stopPropagation();
    $(this).parent().children(".header-level-menu").toggleClass("show");
  });

  $(document).on("click", function () {
    $(".mega-menu-container").removeClass("show");
    $(".header-level-menu").removeClass("show");
  });

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
      $(".mega-menu-container").removeClass("show");
      $(".header-level-menu").removeClass("show");
    }
  });

  // Horizontal menu setup for mobile
  $(".left-header .link-section > div").on("click", function (e) {
    if ($(window).width() <= 1199) {
      $(".left-header .link-section > div").removeClass("active");
      $(this).toggleClass("active");
      $(this).parent().children("ul").toggleClass("d-block").slideToggle();
    }
  });

  if ($(window).width() <= 1199) {
    $(".left-header .link-section").children("ul").css("display", "none");
  }
})(jQuery);

// (function ($) {
//   "use strict";
//   console.log("Sidebar menu script loaded");

//   var page_wrapper = localStorage.getItem("page-wrapper");

//   $(".toggle-nav").on("click", function () {
//     $("#sidebar-links .nav-menu").css("left", "0px");
//   });
//   $(".mobile-back").on("click", function () {
//     $("#sidebar-links .nav-menu").css("left", "-410px");
//   });

//   $(".page-wrapper").attr("class", "page-wrapper " + page_wrapper);
//   if (page_wrapper === null) {
//     $(".page-wrapper").addClass("compact-wrapper");
//   }

//   // left sidebar and vertical menu
//   if ($("#pageWrapper").hasClass("compact-wrapper")) {
//     $(".sidebar-title").append(
//       '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//     );
//     $(".sidebar-title").on("click", function () {
//       $(".sidebar-title")
//         .removeClass("active")
//         .find("div")
//         .replaceWith(
//           '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//         );
//       $(".sidebar-submenu, .menu-content").slideUp("normal");
//       if ($(this).next().is(":hidden")) {
//         $(this).addClass("active");
//         $(this)
//           .find("div")
//           .replaceWith(
//             '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//           );
//         $(this).next().slideDown("normal");
//       }
//     });
//     $(".sidebar-submenu, .menu-content").hide();

//     $(".submenu-title").append(
//       '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//     );
//     $(".submenu-title").on("click", function () {
//       $(".submenu-title")
//         .removeClass("active")
//         .find("div")
//         .replaceWith(
//           '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//         );
//       $(".submenu-content").slideUp("normal");
//       if ($(this).next().is(":hidden")) {
//         $(this).addClass("active");
//         $(this)
//           .find("div")
//           .replaceWith(
//             '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//           );
//         $(this).next().slideDown("normal");
//       }
//     });
//     $(".submenu-content").hide();
//   } else if ($("#pageWrapper").hasClass("horizontal-wrapper")) {
//     $(window).on("resize", checkPosition);
//     function checkPosition() {
//       if (window.matchMedia("(max-width: 1199px)").matches) {
//         $("#pageWrapper")
//           .removeClass("horizontal-wrapper")
//           .addClass("compact-wrapper");
//         $(".page-body-wrapper")
//           .removeClass("horizontal-menu")
//           .addClass("sidebar-icon");
//         $(".submenu-title").append(
//           '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//         );
//         $(".submenu-title").on("click", function () {
//           $(".submenu-title").removeClass("active");
//           $(".submenu-title")
//             .find("div")
//             .replaceWith(
//               '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//             );
//           $(".submenu-content").slideUp("normal");
//           if ($(this).next().is(":hidden")) {
//             $(this).addClass("active");
//             $(this)
//               .find("div")
//               .replaceWith(
//                 '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//               );
//             $(this).next().slideDown("normal");
//           }
//         });
//         $(".submenu-content").hide();

//         $(".sidebar-title").append(
//           '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//         );
//         $(".sidebar-title").on("click", function () {
//           $(".sidebar-title").removeClass("active");
//           $(".sidebar-title")
//             .find("div")
//             .replaceWith(
//               '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//             );
//           $(".sidebar-submenu, .menu-content").slideUp("normal");
//           if ($(this).next().is(":hidden")) {
//             $(this).addClass("active");
//             $(this)
//               .find("div")
//               .replaceWith(
//                 '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//               );
//             $(this).next().slideDown("normal");
//           }
//         });
//         $(".sidebar-submenu, .menu-content").hide();
//       }
//     }
//   }

//   $("#left-arrow").addClass("disabled");
//   var view = $("#sidebar-menu");
//   var move = "500px";
//   var leftsideLimit = -500;

//   $("#right-arrow").on("click", function () {
//     var currentPosition = parseInt(view.css("marginLeft"));
//     if (currentPosition >= sliderLimit) {
//       $("#left-arrow").removeClass("disabled");
//       view.stop(false, true).animate(
//         {
//           marginLeft: "-=" + move,
//         },
//         {
//           duration: 400,
//         }
//       );
//       if (currentPosition == sliderLimit) {
//         $(this).addClass("disabled");
//       }
//     }
//   });

//   $("#left-arrow").on("click", function () {
//     var currentPosition = parseInt(view.css("marginLeft"));
//     if (currentPosition < 0) {
//       view.stop(false, true).animate(
//         {
//           marginLeft: "+=" + move,
//         },
//         {
//           duration: 400,
//         }
//       );
//       $("#right-arrow").removeClass("disabled");
//       if (currentPosition >= leftsideLimit) {
//         $(this).addClass("disabled");
//       }
//     }
//   });

//   // Responsive sidebar
//   var widthwindow = $(window).width();
//   if (widthwindow <= 1184) {
//     $(".sidebar-wrapper").addClass("close_icon");
//     $(".page-header").addClass("close_icon");
//   }
//   $(window).resize(function () {
//     var widthwindow = $(window).width();
//     if (widthwindow <= 1184) {
//       $(".sidebar-wrapper").addClass("close_icon");
//       $(".page-header").addClass("close_icon");
//     } else {
//       $(".sidebar-wrapper").removeClass("close_icon");
//       $(".page-header").removeClass("close_icon");
//     }
//   });

//   // Scroll logic for sidebar menu
//   if (
//     $("#sidebar-menu .simplebar-content-wrapper").hasClass(
//       "a.sidebar-link.sidebar-title.active"
//     )
//   ) {
//     $("#sidebar-menu .simplebar-content-wrapper").animate(
//       {
//         scrollTop: $("a.sidebar-link.sidebar-title.active").offset().top - 200,
//       },
//       1000
//     );
//   }

//   // Toggle sidebar
//   $(document).ready(function () {
//     var $nav = $(".sidebar-wrapper");
//     var $header = $(".page-header");
//     var $toggle_nav_top = $(".toggle-sidebar");
//     var $toggle_btn = $("#sidebar-toggle");

//     $toggle_nav_top.on("click", function () {
//       $nav.toggleClass("close_icon");
//       $header.toggleClass("close_icon");
//       $("body").toggleClass("sidebar-collapsed");
//     });

//     $toggle_btn.on("click", function () {
//       $(".page-wrapper").toggleClass("toggled");
//     });
//   });

// })(jQuery);

// original

// (function ($) {
//   "use strict";
//   console.log("Sidebar menu script loaded");

//   var page_wrapper = localStorage.getItem("page-wrapper", null);

//   $(".toggle-nav").on("click", function () {
//     $("#sidebar-links .nav-menu").css("left", "0px");
//   });
//   $(".mobile-back").on("click", function () {
//     $("#sidebar-links .nav-menu").css("left", "-410px");
//   });

//   $(".page-wrapper").attr("class", "page-wrapper " + page_wrapper);
//   if (page_wrapper === null) {
//     $(".page-wrapper").addClass("compact-wrapper");
//   }

//   // left sidebar and vertical menu
//   if ($("#pageWrapper").hasClass("compact-wrapper")) {
//     $(".sidebar-title").append(
//       '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//     );
//     $(".sidebar-title").on("click", function () {
//       $(".sidebar-title")
//         .removeClass("active")
//         .find("div")
//         .replaceWith(
//           '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//         );
//       $(".sidebar-submenu, .menu-content").slideUp("normal");
//       $(".menu-content").slideUp("normal");
//       if ($(this).next().is(":hidden") == true) {
//         $(this).addClass("active");
//         $(this)
//           .find("div")
//           .replaceWith(
//             '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//           );
//         $(this).next().slideDown("normal");
//       } else {
//         $(this)
//           .find("div")
//           .replaceWith(
//             '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//           );
//       }
//     });
//     $(".sidebar-submenu, .menu-content").hide();
//     $(".submenu-title").append(
//       '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//     );
//     $(".submenu-title").on("click", function () {
//       $(".submenu-title")
//         .removeClass("active")
//         .find("div")
//         .replaceWith(
//           '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//         );
//       $(".submenu-content").slideUp("normal");
//       if ($(this).next().is(":hidden") == true) {
//         $(this).addClass("active");
//         $(this)
//           .find("div")
//           .replaceWith(
//             '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//           );
//         $(this).next().slideDown("normal");
//       } else {
//         $(this)
//           .find("div")
//           .replaceWith(
//             '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//           );
//       }
//     });
//     $(".submenu-content").hide();
//   } else if ($("#pageWrapper").hasClass("horizontal-wrapper")) {
//     $(window).on("load", function () {
//       $(document).load($(window).bind("resize", checkPosition));
//       function checkPosition() {
//         if (window.matchMedia("(max-width: 1199px)").matches) {
//           $("#pageWrapper")
//             .removeClass("horizontal-wrapper")
//             .addClass("compact-wrapper");
//           $(".page-body-wrapper")
//             .removeClass("horizontal-menu")
//             .addClass("sidebar-icon");
//           $(".submenu-title").append(
//             '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//           );
//           $(".submenu-title").on("click", function () {
//             $(".submenu-title").removeClass("active");
//             $(".submenu-title")
//               .find("div")
//               .replaceWith(
//                 '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//               );
//             $(".submenu-content").slideUp("normal");
//             if ($(this).next().is(":hidden") == true) {
//               $(this).addClass("active");
//               $(this)
//                 .find("div")
//                 .replaceWith(
//                   '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//                 );
//               $(this).next().slideDown("normal");
//             } else {
//               $(this)
//                 .find("div")
//                 .replaceWith(
//                   '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//                 );
//             }
//           });
//           $(".submenu-content").hide();

//           $(".sidebar-title").append(
//             '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//           );
//           $(".sidebar-title").on("click", function () {
//             $(".sidebar-title").removeClass("active");
//             $(".sidebar-title")
//               .find("div")
//               .replaceWith(
//                 '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//               );
//             $(".sidebar-submenu, .menu-content").slideUp("normal");
//             if ($(this).next().is(":hidden") == true) {
//               $(this).addClass("active");
//               $(this)
//                 .find("div")
//                 .replaceWith(
//                   '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//                 );
//               $(this).next().slideDown("normal");
//             } else {
//               $(this)
//                 .find("div")
//                 .replaceWith(
//                   '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
//                 );
//             }
//           });
//           $(".sidebar-submenu, .menu-content").hide();
//         }
//       }
//     });
//   }
//   $("#left-arrow").addClass("disabled");
//   $("#right-arrow").on("click", function () {
//     var currentPosition = parseInt(view.css("marginLeft"));
//     if (currentPosition >= sliderLimit) {
//       $("#left-arrow").removeClass("disabled");
//       view.stop(false, true).animate(
//         {
//           marginLeft: "-=" + move,
//         },
//         {
//           duration: 400,
//         }
//       );
//       if (currentPosition == sliderLimit) {
//         $(this).addClass("disabled");
//         console.log("sliderLimit", sliderLimit);
//       }
//     }
//   });

//   $("#left-arrow").on("click", function () {
//     var currentPosition = parseInt(view.css("marginLeft"));
//     if (currentPosition < 0) {
//       view.stop(false, true).animate(
//         {
//           marginLeft: "+=" + move,
//         },
//         {
//           duration: 400,
//         }
//       );
//       $("#right-arrow").removeClass("disabled");
//       $("#left-arrow").removeClass("disabled");
//       if (currentPosition >= leftsideLimit) {
//         $(this).addClass("disabled");
//       }
//     }
//   });

//   // page active
//     $(".sidebar-wrapper nav").find("a").removeClass("active");
//     $(".sidebar-wrapper nav").find("li").removeClass("active");

//     var current = window.location.pathname;
//     $(".sidebar-wrapper nav ul>li a").filter(function () {
//       var link = $(this).attr("href");
//       if (link) {
//         if (current.indexOf(link) != -1) {
//           $(this).parents().children("a").addClass("active");
//           $(this).parents().parents().children("ul").css("display", "block");
//           $(this).addClass("active");
//           $(this)
//             .parent()
//             .parent()
//             .parent()
//             .children("a")
//             .find("div")
//             .replaceWith(
//               '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//             );
//           $(this)
//             .parent()
//             .parent()
//             .parent()
//             .parent()
//             .parent()
//             .children("a")
//             .find("div")
//             .replaceWith(
//               '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
//             );
//           return false;
//         }
//       }
//     });

//   $(".left-header .mega-menu .nav-link").on("click", function (event) {
//     event.stopPropagation();
//     $(this).parent().children(".mega-menu-container").toggleClass("show");
//   });

//   $(".left-header .level-menu .nav-link").on("click", function (event) {
//     event.stopPropagation();
//     $(this).parent().children(".header-level-menu").toggleClass("show");
//   });

//   $(document).on("click", function () {
//     $(".mega-menu-container").removeClass("show");
//     $(".header-level-menu").removeClass("show");
//   });

//   $(window).scroll(function () {
//     var scroll = $(window).scrollTop();
//     if (scroll >= 50) {
//       $(".mega-menu-container").removeClass("show");
//       $(".header-level-menu").removeClass("show");
//     }
//   });

//   $(".left-header .level-menu .nav-link").on("click", function () {
//     if ($(".mega-menu-container").hasClass("show")) {
//       $(".mega-menu-container").removeClass("show");
//     }
//   });

//   $(".left-header .mega-menu .nav-link").on("click", function () {
//     if ($(".header-level-menu").hasClass("show")) {
//       $(".header-level-menu").removeClass("show");
//     }
//   });

//   $(document).ready(function () {
//     $(".outside").on("click", function () {
//       $(this).find(".menu-to-be-close").slideToggle("fast");
//     });
//   });
//   $(document).on("click", function (event) {
//     var $trigger = $(".outside");
//     if ($trigger !== event.target && !$trigger.has(event.target).length) {
//       $(".menu-to-be-close").slideUp("fast");
//     }
//   });

//   $(".left-header .link-section > div").on("click", function (e) {
//     if ($(window).width() <= 1199) {
//       $(".left-header .link-section > div").removeClass("active");
//       $(this).toggleClass("active");
//       $(this).parent().children("ul").toggleClass("d-block").slideToggle();
//     }
//   });

//   if ($(window).width() <= 1199) {
//     $(".left-header .link-section").children("ul").css("display", "none");
//     $(this).parent().children("ul").toggleClass("d-block").slideToggle();
//   }

//   if (
//     $("#sidebar-menu .simplebar-content-wrapper").hasClass(
//       "a.sidebar-link.sidebar-title.active"
//     )
//   ) {
//     $("#sidebar-menu .simplebar-content-wrapper").animate(
//       {
//         scrollTop: $("a.sidebar-link.sidebar-title.active").offset().top - 200,
//       },
//       1000
//     );
//   }
//   // toggle sidebar
//   var $nav = $(".sidebar-wrapper");
//   var $header = $(".page-header");
//   var $toggle_nav_top = $(".toggle-sidebar");
//   $toggle_nav_top.on("click", function () {
//     $nav.toggleClass("close_icon");
//     $header.toggleClass("close_icon");
//     $(window).trigger("overlay");
//   });

//   $(".sidebar-wrapper .back-btn").click(function (e) {
//     $(".page-header").toggleClass("close_icon");
//     $(".sidebar-wrapper").toggleClass("close_icon");
//     $(window).trigger("overlay");
//   });
//   //

//   var $body_part_side = $(".body-part");
//   $body_part_side.on("click", function () {
//     $toggle_nav_top.attr("checked", false);
//     $nav.addClass("close_icon");
//     $header.addClass("close_icon");
//   });

//   //    responsive sidebar
//   var $window = $(window);
//   var widthwindow = $window.width();
//   (function ($) {
//     "use strict";
//     if (widthwindow <= 1184) {
//       $toggle_nav_top.attr("checked", false);
//       $nav.addClass("close_icon");
//       $header.addClass("close_icon");
//     }
//   })(jQuery);
//   $(window).resize(function () {
//     var widthwindaw = $window.width();
//     if (widthwindaw <= 1184) {
//       $toggle_nav_top.attr("checked", false);
//       $nav.addClass("close_icon");
//       $header.addClass("close_icon");
//     } else {
//       $toggle_nav_top.attr("checked", true);
//       $nav.removeClass("close_icon");
//       $header.removeClass("close_icon");
//     }
//   });

//   // horizontal arrows
//   var view = $("#sidebar-menu");
//   var move = "500px";
//   var leftsideLimit = -500;

//   var getMenuWrapperSize = function () {
//     return $(".sidebar-wrapper").innerWidth();
//   };
//   var menuWrapperSize = getMenuWrapperSize();

//   if (menuWrapperSize >= "1660") {
//     var sliderLimit = -3000;
//   } else if (menuWrapperSize >= "1440") {
//     var sliderLimit = -3600;
//   } else {
//     var sliderLimit = -4200;
//   }

// // active link
// // if($('.simplebar-wrapper .simplebar-content-wrapper') && $('#pageWrapper').hasClass('compact-wrapper')) {
// //   $('.simplebar-wrapper .simplebar-content-wrapper').animate({
// //       scrollTop: $('.simplebar-wrapper .simplebar-content-wrapper a.active').offset().top - 400
// //   }, 1000);
//   // }

//   $(document).ready(function () {
//     var $nav = $(".sidebar-wrapper");
//     var $header = $(".page-header");
//     var $toggle_nav_top = $(".toggle-sidebar");
//     var $toggle_btn = $("#sidebar-toggle");

//     $toggle_nav_top.on("click", function () {
//       $nav.toggleClass("close_icon");
//       $header.toggleClass("close_icon");
//       $("body").toggleClass("sidebar-collapsed");
//     });

//     $toggle_btn.on("click", function () {
//       $(".page-wrapper").toggleClass("toggled");
//     });
//   });

//   $(".sidebar-link").on("click", function (e) {
//     if (
//       $(this).hasClass("sidebar-title") &&
//       $(this).next(".sidebar-submenu").length
//     ) {
//       e.preventDefault();
//       $(this).toggleClass("active");
//       $(this).next(".sidebar-submenu").slideToggle();
//     }
//   });

// })(jQuery);

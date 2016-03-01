(function($, w){
  /**
   * [PageScroller description]
   * @param {[type]} selector [description]
   * @param {[type]} option   [description]
   */
  var PageScroller = function(selector, option) {
    var _this = this;
    _this.$wrapper = $(selector);
    _this.$pageList = [];
    $('.page', _this.$wrapper).each(function(i, el) {
      _this.$pageList.push($(el));
    });

    _this.option = $.extend({
      dragThreshold: _this.pageHeight * 0.3,
      releaseThreshold: _this.pageHeight * 0.2,
      scale: 1,
      pageCallback: {},
      needScrollSelector: '.need-scroll',
      needOverScrollSelector: '.need-over-scroll',
      container: window
    }, option);

    _this.containerHeight = $(_this.option.container).height();

    _this.pageHeight = _this.$wrapper.height();
    _this.currentPageIndex = 0;

    _this.dragStartPos = -1;
    $(_this.option.container).on('touchstart.pagescroller', function(e) {
      if (_this.option.needScrollSelector && $(e.target).closest(_this.option.needScrollSelector).length) {
        // 
      } else {
        e.preventDefault();
        _this.dragStart(e);
      }
    }).on('touchmove.pagescroller', function(e) {
      if (_this.option.needScrollSelector && $(e.target).closest(_this.option.needScrollSelector).length) {
        // 
      } else {
        e.preventDefault();
        _this.dragMove(e);
      }
    }).on('touchend.pagescroller', function(e) {
      if (_this.option.needScrollSelector && $(e.target).closest(_this.option.needScrollSelector).length) {
        // 
      } else {
        e.preventDefault();
        _this.dragEnd(e);
      }
    });
  };

  PageScroller.prototype.dragStart = function(e) {
    var _this = this;
    if (_this.dragStartPos == -1) {
      _this.dragStartPos = e.touches[0].clientY;
    }
  };

  PageScroller.prototype.dragMove = function(e) {
    var _this = this,
      moveDistance,
      scrollY;
    if (_this.dragStartPos >= 0) {
      moveDistance = e.touches[0].clientY - _this.dragStartPos;
      if (e.touches[0].clientY > 10 && e.touches[0].clientY < _this.containerHeight - 10) {
        scrollY = 0 - _this.currentPageIndex * _this.pageHeight + moveDistance * _this.option.scale;
        _this.$wrapper.css({
          '-webkit-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
          '-moz-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
          '-o-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
          '-ms-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
          'transform': 'translate3d(0px, ' + scrollY + 'px, 0px)'
        });
      } else {
        _this.dragStartPos= -1;
        _this.scrollToPage(_this.currentPageIndex + (moveDistance < 0 ? 1 : -1));
      }
    }
  };

  PageScroller.prototype.dragEnd = function(e) {
    var _this = this,
      moveDistance,
      scrollY;
    if (_this.dragStartPos >= 0) {
      moveDistance = e.changedTouches[0].clientY - _this.dragStartPos;
      if (Math.abs(moveDistance) < _this.option.releaseThreshold) {
        _this.scrollToPage(_this.currentPageIndex);
      } else {
        _this.scrollToPage(_this.currentPageIndex + (moveDistance < 0 ? 1 : -1));
      }
    }
    _this.dragStartPos = -1;
  };

  PageScroller.prototype.scrollToPage = function(index) {
    var _this = this,
      scrollY;
    if (index < 0) {
      index = 0;
    }
    if (index > _this.$pageList.length - 1) {
      index = _this.$pageList.length - 1;
    }
    console.log(index);
    scrollY = 0 - index * _this.pageHeight;
    _this.$wrapper.addClass('scrolling');
    setTimeout(function() {
      _this.isScrolling = true;
      _this.$wrapper.css({
        '-webkit-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
        '-moz-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
        '-o-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
        '-ms-transform': 'translate3d(0px, ' + scrollY + 'px, 0px)',
        'transform': 'translate3d(0px, ' + scrollY + 'px, 0px)'
      });
      setTimeout(function() {
        _this.$wrapper.removeClass('scrolling');
        _this.isScrolling = false;
        _this.dragStartPos = -1;
        if (_this.option.pageCallback[_this.currentPageIndex]) {
          _this.option.pageCallback[_this.currentPageIndex]();
        }
      }, 1000);
    }, 0);
    _this.currentPageIndex = index;
    $.each(_this.$pageList, function(i, $page) {
      if (i == _this.currentPageIndex) {
        $page.addClass('current');
      } else {
        $page.removeClass('current');
      }
    });
  };

  $.extend($.fn, {
    fullpage: function(option){
      var myFullpage = new PageScroller(this, option);
      $(this).data('PageScroller', myFullpage);
    }
  });
})(Zepto, window);
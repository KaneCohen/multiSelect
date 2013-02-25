(function($) {
	$.fn.multiSelect = function(options) {
		var o = $.extend(true, {}, options);
		return this.each(function(k,v) {
			var ms = $(this).data('multiSelect');
			if (ms) {
				ms.trigger(options);
				return false;
			}
			o.element = $(this);
			new MultiSelect(o);
		});
	};
	function MultiSelect(o) {
		this.init(o);
	}
	MultiSelect.prototype = {
		d: {
			multiple: true,
			selected: 'selected',
			filter:		' > *',
			unselectOn:	   false,
			keepSelection: true,
			callbacks: {
				select:   false, // args: event, this
				unselect: false, // args: event, this
				stop:     false //  args: selected items, current item
			}
		},
		o: {},
		init: function(options) {
			$.extend(true, this.o, this.d, options);
			this.initListeners();
			this.initCallbacks();
			this.o.element.data('multiSelect', this);
		},
		initCallbacks: function() {
			var self = this;
			$.each(this.o.callbacks, function(k, v) {
				self.o.callbacks[k] = function() {
					var args = Array.prototype.slice.call(arguments);
					return self.o.element.triggerHandler(k, args);
				};
			});
		},
		initListeners: function() {
			var self = this;
			this.o.element.off('mousedown.multiSelect', this.o.filter);
			this.o.element.on('mousedown.multiSelect', this.o.filter, function(e) {
				if (e.which == 1) {
					self.selectItems(e);
				}
				return true;
			});
			if (this.o.unselectOn) {
				$(this.o.unselectOn).on('mousedown.multiSelect', function(e) {
					if ( ! $(e.target).parents().is(self.o.element) && e.which != 3) {
						if (self.o.trigger('unselect', e, self) === false) {
							return false;
						}
						$(self.o.list+' .'+self.o.selected).removeClass(self.o.selected);
						self.o.trigger('stop', o.element.find('.'+o.selected), o.element);
					}
				});
			}
		},
		selectItems: function(e) {
			var o = this.o,
					target = e.target,
					item   = $(e.currentTarget),
					list   = this.o.element, first, last;

			if (list.hasClass('ui-sortable-helper')) {
				return false;
			}
			if (this.trigger('select', e, this) === false) {
				return false;
			}

			if (e.shiftKey && o.multiple) {
				item.addClass(o.selected);
				first = list.find('.'+o.selected).first().index();
				last = list.find('.'+o.selected).last().index();

				// if we hold shift and try to select last element that is above current
				if (first == -1 || last == -1) {
					return false;
				}
				if (last < first) {
					[first, last] = [last, first];
				}
				list.find('.'+o.selected).removeClass(o.selected);
				var num = last - first;
				for (var i=0;i<=num;i++) {
					list.find(o.filter).eq(first+i).addClass(o.selected);
				}
				e.preventDefault();
			} else if ((e.ctrlKey || e.metaKey) && o.multiple) {
				// set/unset selection if we hold ctrl/meta key
				item.toggleClass(o.selected);
			} else {
				// do not remove selection on second click on already selected item
				if (o.keepSelection) {
					if ( ! item.hasClass(o.selected) ) {
						list.find('.'+o.selected).removeClass(o.selected);
						item.addClass(o.selected);
					}
				} else {
					list.find('.'+o.selected).removeClass(o.selected);
					item.addClass(o.selected);
				}
			}
			this.trigger('stop', o.element.find('.'+o.selected), o.element);
		},
		destroy: function() {
			this.o.element.removeData('multiSelect');
			this.o.element.off('.multiSelect');
			if (this.o.unselectOn) {
				$(this.o.unselectOn).off('.multiSelect');
			}
		},
		trigger: function(name) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (this.o.callbacks[name]) {
				if (this.o.callbacks[name].apply(this, args) === false)
					return false;
			}
			if (this[name]) {
				if (this[name].apply(this, args) === false)
					return false;
			}
			return true;
		},
	};
})(jQuery);

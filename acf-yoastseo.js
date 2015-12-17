/*! ACF YoastSEO.js v1.0.0 | (c) 2015 FAKTOR VIER GmbH | http://faktorvier.ch */
var AcfYoastSEO = null;

AcfYoastSEOPlugin = function() {
	var self = this;

	self.content = {};
	self.pluginName = 'acf-fields';
	self.modificationPriority = 5;

	/**
	 * Initializes the plugin
	 *
	 * @public
	 * @returns self
	 */
	self.init = function() {
		if(typeof acf !== 'undefined' && typeof YoastSEO !== 'undefined') {
			registerPlugin();
			registerModification();
			bindHooks();
		}

		return self;
	}

	/**
	 * Registers a YoastSEO plugin for ACF
	 *
	 * @private
	 * @returns self
	 */
	var registerPlugin = function() {
		YoastSEO.app.registerPlugin(self.pluginName, { status: 'ready' });

		return self;
	}

	/**
	 * Registers a content modification
	 *
	 * @private
	 * @returns self
	 */
	var registerModification = function() {
		YoastSEO.app.registerModification('content', self.addAcfDataToContent, self.pluginName, self.modificationPriority);

		return self;
	}

	/**
	 * Bind ACF hooks
	 *
	 * @private
	 * @returns self
	 */
	var bindHooks = function() {
		acf.add_action('load_field', self.setContent);
		acf.add_action('change', self.setContent);
		acf.add_action('remove', self.removeContent);

		return self;
	}

	/**
	 * Sets the content for a single ACF field
	 *
	 * @public
	 * @param {Object} $element
	 * @returns {String}
	 */
	self.setContent = function($element) {
		var $fieldParent = $element.closest('[data-type]');
		var $field = null;
		var fieldType = $fieldParent.attr('data-type');
		var fieldId = null;
		var fieldContent = '';


		switch(fieldType) {
			case 'text':
			case 'number':
			case 'email':
				$field = $fieldParent.find('input');
				fieldId = $field.attr('name');
				fieldContent = $field.val();

				break;

			case 'textarea':
			case 'wysiwyg':
				$field = $fieldParent.find('textarea');
				fieldId = $field.attr('name');
				fieldContent = $field.val();

				break;

			case 'url':
				$field = $fieldParent.find('input');
				fieldId = $field.attr('name');

				if($field.val() != '') {
					fieldContent = '<a href="' + $field.val() + '">' + $field.val() + '</a>';
				}

				break;

			case 'image':
				fieldId = $fieldParent.find('[data-name="id"]').attr('name');
				fieldContent = $fieldParent.find('img[src!=""]').prop('outerHTML');

				break;

			case 'gallery':
				fieldId = $fieldParent.find('[data-name="ids"]').attr('name');
				fieldContent = '';

				$fieldParent.find('.thumbnail > img').each(function() {
					fieldContent += fieldContent.prop('outerHTML');
				});

				break;
		}

		if(fieldId == null || fieldContent == '') {
			delete self.content[fieldId];
		} else {
			self.content[fieldId] = fieldContent;
		}

		self.refresh();

		return fieldContent;
	};

	/**
	 * Removes an ACF field from the content
	 *
	 * @public
	 * @param {Object} $element
	 * @returns self
	 */
	self.removeContent = function($element) {
		setTimeout(function() {
			jQuery.each(self.content, function(fieldId, fieldValue) {
				if(!jQuery('body').find('[name="' + fieldId + '"]').length) {
					delete self.content[fieldId];
				}
			});

			self.refresh();
		}, 700);

		return self;
	};

	/**
	 * Adds ACF data to the content
	 *
	 * @public
	 * @param {String} content
	 * @returns {String}
	 */
	self.addAcfDataToContent = function(content) {
		if(Object.keys(self.content).length) {
			jQuery.each(self.content, function(fieldId, fieldValue) {
				content += ' ' + jQuery.trim(fieldValue);
			});
		}

		return content;
	};

	/**
	 * Refreshes the ACF data
	 *
	 * @public
	 * @param {String} content
	 * @returns {String}
	 */
	self.refresh = function() {
		YoastSEO.app.pluginReloaded(self.pluginName);
	}
}

jQuery(window).on('YoastSEO:ready', function() {
	var AcfYoastSEO = new AcfYoastSEOPlugin();
	AcfYoastSEO.init();
});
ACF Support for YoastSEO.js
==============
This plugin adds the fields from <a href="http://www.advancedcustomfields.com/">Advanced Custom Fields (ACF)</a> to the new YoastSEO.js extension.

## Dependencies
* <a href="http://www.advancedcustomfields.com/">ACF 5</a>
* <a href="http://jquery.com/" target="_blank">jQuery 1.9+</a>

## Installation
* Download the file `acf-yoastseo.min.js`
* Upload it to your server (e.g. `/js/` folder in the active theme)

## Enqueue script in WordPress
```php
function enqueue_acf_yoastseo_script() {
	wp_enqueue_script('acf-yoastseo', get_template_directory_uri() . '/js/acf-yoastseo.min.js');
}
add_action('admin_enqueue_scripts', 'enqueue_acf_yoastseo_script');
```

## Supported ACF fields
* Text
* Textarea
* Number
* Email
* URL
* WYSIWYG-Editor
* Image
* Gallery

## Known issues
* Gallery-fields analysis only working on reload

## Changelog

##### v1.0.0 (2015-12-17)
Initial release
# Themeinator - starterkit for Drupal 8

An [atomic design](http://bradfrost.com/blog/post/atomic-web-design/) and [Pattern Lab](http://patternlab.io/) friendly starting point for new Drupal 8 themes. Can be used stand-alone with Pattern Lab. Can be used as a Pattern Lab StarterKit as well.


## Installing development dependencies

Prerequisites: [npm](https://nodejs.org/) installed.

In the theme root directory run:

```sh
yarn
```


## Integrating with Drupal

### Required: Component Libraries module

Install and enable the [Component Libraries module](https://www.drupal.org/project/components). No configuration is needed.


## Integrating with Pattern Lab

Prerequisites: [git](https://git-scm.com/) and [Composer](https://getcomposer.org/) installed.

In the theme root directory run:

```sh
git clone https://github.com/pattern-lab/edition-php-drupal-standard pattern-lab
```

In the `pattern-lab` directory run:

```sh
composer install
```

In the file `pattern-lab/config/config.yml` change `sourceDir` and `twigAutoescape` like so:

 ```yml
 sourceDir: ../dist
 twigAutoescape: false
 ```

To start patter-lab run:

```sh
php core/console --server --with-watch
```

To generate pattern-lab run:

```sh
php core/console --generate
```

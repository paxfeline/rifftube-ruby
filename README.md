# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...







To restore the db from a dump:

heroku pg:backups:restore 'https://github.com/paxfeline/paxfeline.github.io/raw/master/db-backup' DATABASE_URL --app rifftube-ruby --confirm rifftube-ruby
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


process:

psql:
drop database rifftube;
create database rifftube;

shorter:
rake db:drop db:create

pg_restore -O -d rifftube /Users/davidnewberry/Downloads/052f5925-6965-4c43-af03-27a54c07f8fa 
rake db:migrate

no longer needed! :)
    psql:
    \c rifftube
    alter table users drop constraint users_email_unique;





ffmpeg command to concat two files w/ 5s of silence between

ffmpeg -i riff530.mp3 -i riff531.mp3 -filter_complex "aevalsrc=exprs=0:d=5[silence], [0:a] [silence] [1:a] concat=n=3:v=0:a=1[outa]" -map [outa] out.mp3
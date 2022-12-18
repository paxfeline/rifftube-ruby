# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_11_22_061837) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "knex_migrations", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "batch"
    t.timestamptz "migration_time"
  end

  create_table "knex_migrations_lock", primary_key: "index", id: :serial, force: :cascade do |t|
    t.integer "is_locked"
  end

  create_table "riffs", id: :serial, force: :cascade do |t|
    t.binary "audio_datum"
    t.float "duration"
    t.float "start_time"
    t.text "text"
    t.integer "rating"
    t.boolean "isText", default: false, null: false
    t.integer "user_id", null: false
    t.integer "video_id", null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.string "email", limit: 255
    t.binary "riff_pic"
    t.string "password_digest"
    t.index ["email"], name: "users_email_unique", unique: true
  end

  create_table "videos", id: :serial, force: :cascade do |t|
    t.string "url", limit: 255, null: false
    t.string "title", limit: 255
    t.float "duration"
    t.string "host", limit: 255, default: "youtube.com"
    t.index ["url"], name: "videos_url_unique", unique: true
  end

  create_table "videos_users", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "video_id"
  end

  add_foreign_key "riffs", "users", name: "riffs_user_id_foreign", on_update: :cascade, on_delete: :cascade
  add_foreign_key "riffs", "videos", name: "riffs_video_id_foreign", on_update: :cascade, on_delete: :cascade
  add_foreign_key "videos_users", "users", name: "videos_users_user_id_foreign", on_update: :cascade, on_delete: :cascade
  add_foreign_key "videos_users", "videos", name: "videos_users_video_id_foreign", on_update: :cascade, on_delete: :nullify
end

Run with

rake start



isText means "is text only"


edit riff form:

use audio:          isText  speak
- recorded          false   false
- synthesized       true    true 
- no                true    false

show text?          show = t/f

duration (under advanced):  auto-duration = t/f
- custom
- auto (synthesized audio duration)

"use recorded [or synthesized] audio" (isText = false [or speak = true]) will set auto-duration = true

if "use no audio" is chosen (i.e. radio button clicked, or 't' is pressed instead of 'r'), then "show text" (showText) will be set to true (though it can be de-selected)

isText = false -> auto-duration = true, speak = false (show = t/f)
isText = true, speak = false -> show = true (auto-duration = t/f)
isText = true, speak = true -> auto-duration = true (show = t/f)




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



current node v

v12.16.2











api endpoints


server.get('/api-status', (req, res) => {
res.status(200).json({ api: 'running', updated: '5.29' });

    /

// return given riff's audio data
server.get('/load-riff/:id', (req, res) => {
    res.status(200).send(aud.audio);

    Change to: /riffs/:id

// delete riff
server.delete('/riff-remove/:id', (req, res) => {
    res.status(204).end();

    Change to: /riffs/:id

// sets the "riffer name" for a given user
server.post('/set-name', (req, res) => {
      data: { newName },
        res.status(200).json({ status: 'ok', name: body.newName, user_id })

    Change to: PATCH /user/:id/name
        newName to name

// returns the riffs of a current user for a given video
server.post('/get-riffs/:videoID', (req, res) => {
        res.status(200).json({
            status: 'ok', // meaningless (to computers)
            body: riffList,
            name,
            user_id: uID,
        });

    Change to: GET /riffs?video_id=xxx&user_id=self
        "self" or some other constant can refer to the logged in user

// update riff time.
server.post('/update-riff-time', (req, res) => {
    .then(() => res.status(200).json({ status: 'ok', type: 'edit' }))

    Change to: PATCH /riffs/:id[?fields=start]

// save riff does as it name suggests.
server.post('/save-riff', upload.single('blob'), (req, res) => {
        .then(() => res.status(200).json({ status: 'ok', type: 'edit' }))

    Change to: POST/PATCH /riffs[/:id]

// get view riffs essentially returns riff meta for a video.
server.get('/get-view-riffs/:videoID', (req, res) => {
    res.status(200).json({
    status: 'ok',
    body: riffList.map((el) => ({ ...el, video_id: videoID })),
    timestamp: Date.now(),
    });

    Change to: GET /riffs?video_id=xxx
        No user_id means return all riffs

// get info for account page
server.get('/get-user-data/:token', (req, res) => {
    res.status(200).json({
        status: 'ok',
        userid,
        name: riffer,
        body,
    });

    Implemented

    Returns:
        Status 200:
        {
            "body" => riffs,
            "status" => "ok",
            "user_id" -- Depricating
        }
        Status: 401 Unauthorized

    Change to: GET /users/self

// get info for public profile
server.get('/get-user-data-by-id/:id', (req, res) =>
res.status(200).json({
    status: 'ok',
    name,
    body
});

    Change to: /users/:id

// get global video list
server.get('/get-global-video-list', (req, res) =>
res.status(200).json({
    status: 'ok',
    body
});

    Implemented

    Returns:
        Status 200:
        {
            "body": Array of riff metadata
            "status": "ok"
            "user_id" -- Depricating
        }

// get riffer pic
const default_pic = fs.readFileSync(path.join(__dirname, 'default_pic.png'));
server.get('/get-riffer-pic/:id', (req, res) =>
    if (pic === null)
    res.status(200).send(default_pic);
    else
    res.status(200).send(pic);

    Implemented
    TODO: send default pic

// save pic does as it name suggests.
server.post('/save-pic', upload.single('image'), (req, res) =>
        res.status(200).json({ status: 'ok', user_id })
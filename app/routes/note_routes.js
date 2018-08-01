import {ObjectID} from 'mongodb';

export default function (app, db) {

  app.post('/notes', (req, res) => {
    const note = {text: req.body.text, title: req.body.title};
    db.collection('notes').insert(note, (err, item) => {
      if (err) {
        res.send({'error': 'An error has occurred.'});
      } else {
        res.send(item.ops[0]);
      }
    });
  });

  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const noteID = {'_id': new ObjectID(id)};
    db.collection('notes').findOne(noteID, (err, item) => {
      if (err) {
        res.send('An error has occurred.');
      } else {
        res.send(item);
      }
    });
  });

  app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const noteID = {'_id': new ObjectID(id)};
    const updatedNote = {text: req.body.text, title: req.body.title};
    db.collection('notes').update(noteID, updatedNote, (err, item) => {
      if (err) {
        res.send('An error has occurred.');
      } else {
        res.send(item);
      }
    });
  });

  app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const noteID = {'_id': new ObjectID(id)};
    db.collection('notes').remove(noteID, (err, item) => {
      if (err) {
        res.send('An error has occurred.')
      } else {
        res.send('Note ' + id + ' successfully deleted.');
      }
    })
  });

  app.post('/notes/:id/like', (req, res) => {

    const id = req.params.id;
    const noteID = {'_id': new ObjectID(id)};
    const userAddress = req.connection.remoteAddress;
    const like = {user: userAddress, note: noteID};

    db.collection('likes').findOne(like, (err, item) => {
      //Check if the user has already like the note
      if (item) {
        res.send('You have already liked the note ' + item.note._id)
      } else {
        //If the user previously disliked the note, remove the dislike
        db.collection('dislikes').remove(like, (err, item) => {
          if (err) {
            res.send('An error has occurred.')
          } else {
            //Add a like for this user and note
            db.collection('likes').insert(like, (err, item) => {
              if (err) {
                res.send('An error has occurred.')
              } else {
                res.send(item.ops[0]);
              }
            });
          }
        });
      }
    });

  });

  app.post('/notes/:id/dislike', (req, res) => {
    const id = req.params.id;
    const noteID = {'_id': new ObjectID(id)};
    const userAddress = req.connection.remoteAddress;
    const dislike = {user: userAddress, note: noteID};

    db.collection('dislikes').findOne(dislike, (err, item) => {
      //Check if the user has already disliked the note
      if (item) {
        res.send('You have already disliked the note ' + item.note._id)
      } else {
        //If the user previously liked the note, remove the like
        db.collection('likes').remove(dislike, (err, item) => {
          if (err) {
            res.send('An error has occurred.')
          } else {
            //Add a dislike for this user and note
            db.collection('dislikes').insert(dislike, (err, item) => {
              if (err) {
                res.send('An error has occurred.')
              } else {
                res.send(item.ops[0]);
              }
            });
          }
        });
      }
    });

  });

};
const Seat = require('../models/seat.model');
const Concert = require('../models/concert.model');
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {

  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) res.status(404).json({ message: 'Not found' });
    else res.json(seat);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.post = async (req, res) => {

  try {
    const cleanBody = sanitize(req.body);
    const { day, seat, client, email } = cleanBody;
    const newSeat = new Seat({ day: day, seat: seat, client: client, email: email });
    await newSeat.save();
    const refreshSeats = await Seat.find();
    req.io.emit('seatsUpdate', refreshSeats);
    const concert = await Concert.findOne({ day: day });
    const updatedTickets = concert.ticket - 1
    const result = await Concert.findOneAndUpdate({ day: day }, { $set: { ticket: updatedTickets } });
    if (result) {
      res.json({ message: 'OK' });
    }
    else {
      res.status(404).json({ message: 'Brak koncertu w tym dniu' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.put = async (req, res) => {
  const { day, seat, client, email } = req.body;

  try {
    const sea = await Seat.findById(req.params.id);
    if (sea) {
      sea.day = day;
      sea.seat = seat;
      sea.client = client;
      sea.email = email;
      await sea.save();
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.delete = async (req, res) => {

  try {
    const seat = await Seat.findById(req.params.id);
    if (seat) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};
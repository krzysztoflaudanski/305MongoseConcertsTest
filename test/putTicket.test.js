const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const Concert = require('../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Concert', () => {

    describe('PUT /api/concerts/day/:day', () => {
        before(async () => {
            const testConOne = new Concert({
                _id: '5d9f1140f10a81216cfd4408',
                name: 'Concert #1',
                day: 5,
                ticket: 20,
                image: "/img/uploads/1fsd324fsdg.jpg",
                performer: "John",
                genre: "Rock",
                price: 10
            });
            await testConOne.save();
        });

        it('should update tickets for a concert by day', async () => {

            const dayToUpdate = 5;
            const updatedTicketCount = 15;

            const res = await request(server)
                .put(`/api/concerts/day/${dayToUpdate}`)
                .send({ ticket: updatedTicketCount });

            expect(res.status).to.be.equal(200);
            expect(res.body).to.have.property('message').that.equals('OK');
        });

        it('should return 404 for non-existing concert', async () => {
            const nonExistentDay = 2;
            const updatedTicketCount = 15;

            const res = await request(server)
                .put(`/api/concerts/day/${nonExistentDay}`)
                .send({ ticket: updatedTicketCount });

            expect(res.status).to.be.equal(404);
            expect(res.body).to.have.property('message').that.includes('Brak koncertu w tym dniu');
        });

        after(async () => {
            await Concert.deleteMany();
        });
    });
});

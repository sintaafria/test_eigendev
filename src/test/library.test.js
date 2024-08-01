const request = require("supertest");
const app = require("../../server");
const mongoose = require("mongoose");
const { books, members } = require("./mockData");
const MemberRepository = require("../domain/repositories/MemberRepository")

beforeAll(async () => {
	await mongoose.connect("mongodb://localhost:27017/library-jest-test");
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});

describe("/books api test", () => {
	describe("positive case", () =>{
		test("It should successfully insert batch of books", async () => {
			const response = await request(app).post("/api/books").send(books);
			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toEqual(books.length);
			expect(response.body[0].code).toBe(books[0].code);
			expect(response.body[0].author).toBe(books[0].author);
			expect(response.body[0].title).toBe(books[0].title);
			expect(response.body[0].copies).toBe(books[0].copies);
			expect(response.body[0].stock).toBe(books[0].copies);
		});
		test("It should successfully get all of books", async () => {
			const response = await request(app).get("/api/books");
			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toEqual(books.length);
			expect(response.body[0].code).toBe(books[0].code);
			expect(response.body[0].author).toBe(books[0].author);
			expect(response.body[0].title).toBe(books[0].title);
			expect(response.body[0].stock).toBe(books[0].copies);
		});
	})
	describe("Negative Case", () =>{
		test("It should fail insert batch of books", async () => {
			const response = await request(app).post("/api/books").send(books);
			expect(response.statusCode).toBe(400);
		});
	})
});

describe("/members api test", () => {
	describe("positive case", () =>{
		test("It should successfully insert batch of members", async () => {
			const response = await request(app).post("/api/members").send(members);
			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toEqual(members.length);
			expect(response.body[0].code).toBe(members[0].code);
			expect(response.body[0].name).toBe(members[0].name);
		});
		test("It should successfully get all of members", async () => {
			const response = await request(app).get("/api/members");
			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toEqual(members.length);
			expect(response.body[0].code).toBe(members[0].code);
			expect(response.body[0].name).toBe(members[0].name);
		});
	})
	describe("Negative Case", () =>{
		test("It should fail insert batch of members", async () => {
			const response = await request(app).post("/api/members").send(members);
			expect(response.statusCode).toBe(400);
		});
	})
});

describe("/borrow-book api test", () => {
	describe("positive case", () =>{
		test("It should successfully borrowed book", async () => {
			const response = await request(app).post("/api/borrow-book").send(
				{
					"member_code": "M001",
					"book_code": "SHR-1"
				}
			);
			expect(response.statusCode).toBe(200);
		});
	})
	describe("negative case", () =>{
		describe("It should fail borrowed book", () => {
			test("It should be member is not found", async () => {
				const response = await request(app).post("/api/borrow-book").send(
					{
						"member_code": "K001",
						"book_code": "SHR-1"
					}
				);
				expect(response.statusCode).toBe(400);
				expect(response.body.error).toBe("Member is not found")
			});
			test("It should be book is not found", async () => {
				const response = await request(app).post("/api/borrow-book").send(
					{
						"member_code": "M001",
						"book_code": "Tst-1"
					}
				);
				expect(response.statusCode).toBe(400);
				expect(response.body.error).toBe("Book is not found")
			});
			test("It should be book is not available", async () => {
				const response = await request(app).post("/api/borrow-book").send(
					{
						"member_code": "M001",
						"book_code": "SHR-1"
					}
				);
				expect(response.statusCode).toBe(400);
				expect(response.body.error).toBe("Book is not available")
			});
			
			test("It should be member is currently penalized", async () => {
				const member_code = "M001"
				const book_code = "JK-45"
				const {_id} = await MemberRepository.findByCode(member_code)
				penalty_end_date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
				await MemberRepository.updateMember(_id, {
					penalty_end_date,
				});
				const response = await request(app).post("/api/borrow-book")
								.send({member_code,book_code});
				expect(response.statusCode).toBe(400);
				expect(response.body.error).toBe("Member is currently penalized")
				await MemberRepository.updateMember(_id, {
					penalty_end_date: null
				});
			});
			test("It should be Member cannot borrow more than 2 books", async () => {
				await request(app).post("/api/borrow-book").send(
					{
						"member_code": "M001",
						"book_code": "JK-45"
					}
				)
				const response = await request(app).post("/api/borrow-book").send({
					"member_code": "M001",
					"book_code": "HOB-83"
				});
				expect(response.statusCode).toBe(400);
				expect(response.body.error).toBe("Member cannot borrow more than 2 books")
			});
		})
	})
});

describe("/return-book api test", () => {
	describe("positive case", () =>{
		test("It should successfully returned book", async () => {
			const response = await request(app).post("/api/return-book").send(
				{
					"member_code": "M001",
					"book_code": "SHR-1"
				}
			);
			expect(response.statusCode).toBe(200);
		});
	})
	describe("negative case", () =>{
		test("It should be member is not found", async () => {
			const response = await request(app).post("/api/return-book").send(
				{
					"member_code": "K001",
					"book_code": "SHR-1"
				}
			);
			expect(response.statusCode).toBe(400);
			expect(response.body.error).toBe("Member is not found")
		});
		test("It should be book is not found", async () => {
			const response = await request(app).post("/api/return-book").send(
				{
					"member_code": "M001",
					"book_code": "Tst-1"
				}
			);
			expect(response.statusCode).toBe(400);
			expect(response.body.error).toBe("Book is not found")
		});
		test("It should be book was not borrowed by this member", async () => {
			const response = await request(app).post("/api/return-book").send(
				{
					"member_code": "M001",
					"book_code": "HOB-83"
				}
			);
			expect(response.statusCode).toBe(400);
			expect(response.body.error).toBe("This book was not borrowed by this member")
		});
	})
});
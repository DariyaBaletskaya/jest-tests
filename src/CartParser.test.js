import CartParser from "./CartParser";
import cart from "../samples/cart";

//replace with your own absolute path to file cart-errors.csv
const ABSOLUTE_PATH = "C:/Users/Dariya/Desktop/BSA8";
let parser, validate, parseLine, parse, readFile;
let errorHeaderSample,
  errorRowCellsSample,
  errorCellStringSample,
  errorCellNumberSample,
  correctSample;
let contentHeaderError,
  contentRowCellsError,
  contentCellStringError,
  contentCellNumberError,
  contentCorrect,
  csvLine;
let jsonCart;

beforeAll(() => {
  correctSample = `${ABSOLUTE_PATH}/BSA2019-Testing/samples/cart.csv`;
  errorHeaderSample = `${ABSOLUTE_PATH}/BSA2019-Testing/samples/cart-header-error.csv`;
  errorRowCellsSample = `${ABSOLUTE_PATH}/BSA2019-Testing/samples/cart-rowcells-error.csv`;
  errorCellStringSample = `${ABSOLUTE_PATH}/BSA2019-Testing/samples/cart-cell-string-error.csv`;
  errorCellNumberSample = `${ABSOLUTE_PATH}/BSA2019-Testing/samples/cart-cell-number-error.csv`;
});

beforeEach(() => {
  parser = new CartParser();
  validate = parser.validate.bind(parser);
  readFile = parser.readFile.bind(this);
  parse = parser.parse.bind(parser);
  parseLine = parser.parseLine.bind(parser);
});

describe("CartParser - unit tests", () => {
  beforeEach(() => {
    //given
    csvLine = `Mollis consequat,9.00,2`;
    contentCorrect = parser.readFile(correctSample);
    contentHeaderError = parser.readFile(errorHeaderSample);
    contentRowCellsError = parser.readFile(errorRowCellsSample);
    contentCellStringError = parser.readFile(errorCellStringSample);
    contentCellNumberError = parser.readFile(errorCellNumberSample);
  });
  it("should returned object with defined properties after parsing", () => {
    //when
    let parsedLine = parser.parseLine(csvLine);
    //then
    expect(parsedLine).toHaveProperty("id", "name", "price", "quantity");
  });

  it("should returned object with  property 'name' to be equal given value", () => {
    //when
    let parsedLine = parser.parseLine(csvLine);
    //then
    expect(parsedLine["name"]).toEqual(`Mollis consequat`);
  });

  it("should returned object with  property 'price' to be equal given value", () => {
    //when
    let parsedLine = parser.parseLine(csvLine);
    //then
    expect(parsedLine["price"]).toEqual(9);
  });
  it("should returned object with  property 'quantity' to be equal given value", () => {
    //when
    let parsedLine = parser.parseLine(csvLine);
    //then
    expect(parsedLine["quantity"]).toEqual(2);
  });

  it("should throw header error if file doesn't pass the validation", () => {
    //when
    let validation = parser.validate(contentHeaderError);
    //then
    expect(validation[0].message).toMatch(/Expected header to be named/);
  });

  it("should throw row cells error if file doesn't pass the validation", () => {
    //when
    let validation = parser.validate(contentRowCellsError);
    //then
    expect(validation[0].message).toMatch(/Expected row /);
  });

  it("should throw cell type error if the cell isn't of type string", () => {
    //when
    let validation = parser.validate(contentCellStringError);
    //then
    expect(validation[0].message).toMatch(
      /Expected cell to be a nonempty string /
    );
  });

  it("should throw cell type error if the cell isn't of type number", () => {
    //when
    let validation = parser.validate(contentCellNumberError);
    //then
    expect(validation[0].message).toMatch(
      /Expected cell to be a positive number /
    );
  });

  it("should return an empty array, as the content of the file is correct", () => {
    //when
    let validation = parser.validate(contentCorrect);
    //then
    expect(validation).toEqual(expect.arrayContaining([]));
  });
});

describe("CartParser - integration test", () => {
  it("should return an empty array, as the content of the file is correct", () => {
    //given
    let expectedCart = {
      items: [
        {
          id: expect.stringMatching(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
          name: "Mollis consequat",
          price: 9,
          quantity: 2
        },
        {
          id: expect.stringMatching(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
          name: "Tvoluptatem",
          price: 10.32,
          quantity: 1
        },
        {
          id: expect.stringMatching(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
          name: "Scelerisque lacinia",
          price: 18.9,
          quantity: 1
        },
        {
          id: expect.stringMatching(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
          name: "Consectetur adipiscing",
          price: 28.72,
          quantity: 10
        },
        {
          id: expect.stringMatching(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/),
          name: "Condimentum aliquet",
          price: 13.9,
          quantity: 1
        }
      ],
      total: 348.32
    };
    //when
    let parsedCart = parser.parse(correctSample);
    //then
    expect(parsedCart).toMatchObject(expectedCart);
  });
});

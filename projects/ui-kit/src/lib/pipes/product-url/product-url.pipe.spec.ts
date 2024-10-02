import { TestBed } from "@angular/core/testing"
import { PRODUCT_URL, ProductUrlPipe } from "./product-url.pipe"

describe('ProductUrlPipe', () => {
  it('should properly build the url', () => {
    const {pipe, testProductURL} = setup();
    expect(pipe.transform(123)).toBe(testProductURL+'/product/123')
  })
  it('should throw the error if invalid id is provided', () => {
    const {pipe} = setup();
    expect(() => {
      pipe.transform(0);
    }).toThrowError(/Invalid product id/)
  })
  it('should throw an error if the baseURL is not provided', () => {
    const {pipe} = setup('');
    expect(() => {
      pipe.transform(123);
    }).toThrowError(/URL was not provided/)
  })
})

function setup(testURL = 'https://test.com') {
  TestBed.configureTestingModule({
    providers: [
      ProductUrlPipe,
      {
        provide: PRODUCT_URL,
        useValue: testURL
      }
    ]
  })
  const pipe = TestBed.inject(ProductUrlPipe);
  const testProductURL = TestBed.inject(PRODUCT_URL);
  return { pipe, testProductURL };
}
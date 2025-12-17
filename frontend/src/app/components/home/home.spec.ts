import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Home } from './home';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Home Component', () => {

beforeEach(async () => {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [
      Home, 
      HttpClientTestingModule, // <--- ADD THIS
      RouterTestingModule
    ]
  }).compileComponents();
});

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
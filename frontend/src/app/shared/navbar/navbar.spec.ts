import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../userService/userService';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    const userServiceSpy = jasmine.createSpyObj('UserService', [], { user: null });

    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
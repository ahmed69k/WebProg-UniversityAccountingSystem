import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFound } from './not-found';
import { RouterTestingModule } from '@angular/router/testing';

describe('NotFound Component', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    // FIX 1: Reset module to prevent "already instantiated" error
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [NotFound, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the 404 error code', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('404');
  });

  it('should display the "Page Not Found" message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).toContain('Page Not Found');
  });
});
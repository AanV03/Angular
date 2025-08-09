import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarArtistaNuevoComponent } from './agregar-artista-nuevo.component';

describe('AgregarArtistaNuevoComponent', () => {
  let component: AgregarArtistaNuevoComponent;
  let fixture: ComponentFixture<AgregarArtistaNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarArtistaNuevoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarArtistaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

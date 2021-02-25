import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizerComponent } from '@app/components/resizer/resizer.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerModule } from './components/color-picker/color-picker.module';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageCarrouselComponent } from './components/main-page/main-page-carrousel/main-page-carrousel.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NewDrawingBoxComponent } from './components/sidebar/new-drawing-box/new-drawing-box.component';
import { SidebarAerosolComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-aerosol/sidebar-aerosol.component';
import { SidebarEllipseComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-ellipse/sidebar-ellipse.component';
import { SidebarEraserComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-eraser/sidebar-eraser.component';
import { SidebarLineComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-line/sidebar-line.component';
import { SidebarPencilComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-pencil/sidebar-pencil.component';
import { SidebarPolygoneComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-polygone/sidebar-polygone.component';
import { SidebarRectangleComponent } from './components/sidebar/sidebar-tools-options-2.0/sidebar-rectangle/sidebar-rectangle.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        MainPageCarrouselComponent,
        NewDrawingBoxComponent,
        ResizerComponent,
        SidebarPencilComponent,
        SidebarEraserComponent,
        SidebarRectangleComponent,
        SidebarEllipseComponent,
        SidebarLineComponent,
        SidebarPolygoneComponent,
        SidebarAerosolComponent,
    ],
    entryComponents: [MainPageCarrouselComponent],
    imports: [
        ColorPickerModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatToolbarModule,
        MatCardModule,
        MatTooltipModule,
        MatSliderModule,
        MatRadioModule,
        MatCheckboxModule,
        DragDropModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

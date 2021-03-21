import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizerComponent } from '@app/components/resizer/resizer.component';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerModule } from './components/color-picker/color-picker.module';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageCarrouselComponent } from './components/main-page/main-page-carrousel/main-page-carrousel.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NewDrawingBoxComponent } from './components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveCompletePageComponent } from './components/sidebar/save-drawing-page/save-complete-page/save-complete-page.component';
import { SaveDrawingComponent } from './components/sidebar/save-drawing-page/save-drawing.component';
import { SaveErrorPageComponent } from './components/sidebar/save-drawing-page/save-error-page/save-error-page.component';
import { SaveSavingPageComponent } from './components/sidebar/save-drawing-page/save-saving-page/save-saving-page.component';
import { TagInputComponent } from './components/sidebar/save-drawing-page/tag-input/tag-input.component';
import { TitleInputComponent } from './components/sidebar/save-drawing-page/title-input/title-input.component';
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
        DrawingComponent,
        EditorComponent,
        ExportDrawingComponent,
        MainPageComponent,
        MainPageCarrouselComponent,
        NewDrawingBoxComponent,
        ResizerComponent,
        SidebarAerosolComponent,
        SidebarComponent,
        SidebarPencilComponent,
        SidebarEraserComponent,
        SidebarRectangleComponent,
        SidebarEllipseComponent,
        SidebarLineComponent,
        SaveDrawingComponent,
        SaveCompletePageComponent,
        SaveSavingPageComponent,
        SaveErrorPageComponent,
        SidebarPolygoneComponent,
        TagInputComponent,
        TitleInputComponent,
    ],
    entryComponents: [MainPageCarrouselComponent],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ColorPickerModule,
        DragDropModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSliderModule,
        MatRadioModule,
        MatCheckboxModule,
        DragDropModule,
        FormsModule,
        MatProgressSpinnerModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { animate } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(){}

  public ngAfterViewInit(){
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight);
    camera.position.set(0,0,10);

    

    const box = new THREE.BoxGeometry(1,1,1);
    //const boxMat = new THREE.MeshBasicMaterial({color : 0xfff000});
    //const mesh = new THREE.Mesh(box, boxMat);

    //scene.add(mesh);

    const pointLight = new THREE.PointLight(0xeeeeee, 20000, 10);
    pointLight.position.set(8,3,0);
    scene.add(pointLight);

    const hemiLight = new THREE.HemisphereLight( 0x87CEEB, 0x080820, 30 );
    scene.add( hemiLight );

    const render = new THREE.WebGLRenderer({
      canvas: this.canvas?.nativeElement
    });

    const caca = new OrbitControls(camera, render.domElement)

    // function loop(){

    //   requestAnimationFrame(loop);

    //   mesh.rotation.y += 0.01;
    //   mesh.rotation.x += 0.01;


    // }

    // loop();

    const loader = new OBJLoader();

    let objUse: THREE.Group<THREE.Object3DEventMap>; 
    
    const mtlLoader = new MTLLoader();

    mtlLoader.load(
      'assets/models/contenantLiquidSteel.mtl', // URL vers le fichier MTL
      (materials) => {
        materials.preload(); // Précharge les matériaux

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials); // Associe les matériaux au loader OBJ

        objLoader.load(
          'assets/models/contenantLiquidSteel.obj', // URL vers le fichier OBJ
          (object) => {
            // Callback après chargement du modèle
            objUse = object;
            scene.add(object);
          },
          (xhr) => {
            // Callback pendant le chargement pour afficher la progression
            console.log((xhr.loaded / xhr.total) * 100 + '% chargé');
          },
          (error) => {
            // Callback en cas d'erreur
            console.error('Une erreur est survenue lors du chargement du modèle', error);
          }
        );
      },
      undefined, // Optionnel : callback pour la progression du chargement des matériaux
      (error) => {
        // Callback en cas d'erreur pour le chargement des matériaux
        console.error('Une erreur est survenue lors du chargement des matériaux', error);
      }
    );

    

    function animate(): void {
      // Animation et rendu de la scène
      requestAnimationFrame(animate);
  
      objUse.rotation.y += 0.01;

        // Rotation continue de la caméra ou de l'objet
       
  
        // Rendu de la scène
      render.render(scene, camera);
    }

    animate();
    
  }
}

/*
  Copied and adapted from src/model.js
  - Keeps Model and HintHotspot for ship and interactions
  - Uses /Riva88Folgore_9.glb from water-shader/public
*/
import React, { useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function HintHotspot({
  position,
  isFirstPerson,
  icon,
  label,
  onClick,
  nearDistance = 8,
  forceVisible = false,
  renderAsDot = false,
  pulse = false,
  description = null,
  uiVisible = true,
}) {
  const [hovered, setHovered] = useState(false);
  const [blinkOn, setBlinkOn] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const { camera } = useThree();

  const camPos = camera.position;
  const dx = camPos.x - position[0];
  const dy = camPos.y - position[1];
  const dz = camPos.z - position[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const isNear = distance < nearDistance;

  React.useEffect(() => {
    if (!pulse) return;
    const id = setInterval(() => setBlinkOn((prev) => !prev), 800);
    return () => clearInterval(id);
  }, [pulse]);

  React.useEffect(() => {
    let timeoutId;
    if (hovered && description) {
      timeoutId = setTimeout(() => setShowDescription(true), 300);
    } else {
      setShowDescription(false);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [hovered, description]);

  if (!forceVisible) {
    if (!isFirstPerson || !isNear) return null;
  }
  if (!uiVisible) return null;

  return (
    <group position={position}>
      <Html
        position={[0, 0.5, 0]}
        occlude={false}
        billboard
        style={{
          pointerEvents: "auto",
          userSelect: "none",
          opacity: uiVisible ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      >
        {renderAsDot ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.25)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                cursor: "pointer",
                transform: hovered ? "scale(1.15)" : pulse ? (blinkOn ? "scale(1.05)" : "scale(0.95)") : "scale(1)",
                opacity: hovered ? 1 : pulse ? (blinkOn ? 1 : 0.6) : 1,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={onClick}
              title={label}
            />
            {showDescription && description && (
              <div
                style={{
                  position: "absolute",
                  top: "-35px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 1000,
                  transition: "opacity 0.2s ease-out",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {description}
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "4px solid rgba(0, 0, 0, 0.8)",
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                background: hovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(4px)",
                borderRadius: "8px",
                padding: "4px 6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                transform: hovered ? "scale(1.03)" : "scale(1)",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                border: "0.5px solid rgba(255, 255, 255, 0.35)",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: "10px",
                fontWeight: 600,
                color: "#333",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={onClick}
            >
              <span style={{ fontSize: "11px" }}>{icon}</span>
              <span>{label}</span>
            </div>
            {showDescription && description && (
              <div
                style={{
                  position: "absolute",
                  top: "-35px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 1000,
                  transition: "opacity 0.2s ease-out",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {description}
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "4px solid rgba(0, 0, 0, 0.8)",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </Html>
    </group>
  );
}

export function Model(props) {
  const { nodes, materials } = useGLTF("/Riva88Folgore_9.glb");

  const mainPaintMaterial = materials.Main_Paint.clone();
  if (props.mainPaintColor && props.mainPaintColor !== "#original") {
    mainPaintMaterial.color.set(props.mainPaintColor);
  }

  const showSofaA = props.sofaType !== "SofaB";

  return (
    <group {...props} dispose={null}>
      <HintHotspot
        position={[3.1, 2, -0.5]}
        isFirstPerson={props.isFirstPerson}
        label={"Main_Paint"}
        onClick={props.onShowPaintUI}
        nearDistance={1000}
        forceVisible={true}
        renderAsDot={true}
        pulse={true}
        description={"Clicca per cambiare colore principale"}
        uiVisible={props.uiVisible}
      />

      {!props.isFirstPerson && (
        <HintHotspot
          position={[0.2, 3.55, -4.2]}
          isFirstPerson={props.isFirstPerson}
          label={"Entra"}
          onClick={props.onEnterFirstPerson}
          nearDistance={1000}
          forceVisible={true}
          renderAsDot={true}
          pulse={true}
          description={"Clicca per entrare nella nave"}
          uiVisible={props.uiVisible}
        />
      )}

      {/* Ship meshes */}
      <group position={[0, -1.4, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_BlackPlasticGlossy.geometry}
          material={materials.BlackPlasticGlossy}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Chrome.geometry}
          material={materials.Chrome}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Display.geometry}
          material={materials.DisplayEsterno}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Fabric.geometry}
          material={materials.Fabric}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Fill_holes.geometry}
          material={materials.Fill_holes}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_flasher_green.geometry}
          material={materials.flasher_green}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_flasher_red.geometry}
          material={materials.flasher_red}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Glass.geometry}
          material={materials.Glass}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Grey.geometry}
          material={materials.Fabric_grey}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Grill.geometry}
          material={materials.Grill}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Leds.geometry}
          material={materials.Leds}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_MainPaint.geometry}
          material={mainPaintMaterial}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_panels_plastics.geometry}
          material={materials.panels_plastics}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_Steel.geometry}
          material={materials.Steel}
          position={[-0.222, 1.217, 13.001]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM2_riva_88_TeakFloor.geometry}
          material={materials.TeakFloor}
          position={[-0.001, 4.137, 9.982]}
        />
      <group position={[0, 3.739, 6.967]}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh009.geometry} material={materials.TeakFloor_Bordo} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh009_1.geometry} material={materials.Fughe} />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SM2_riva_88_WoodTable.geometry}
        material={materials.WoodEsterni}
        position={[-0.222, 1.217, 13.001]}
      />
        {/* Table variants with hotspot */}
        {!props.tableType || props.tableType !== "TableB" ? (
          <group position={[-0.367, 3.316, -3.281]}>
            <mesh castShadow receiveShadow geometry={nodes.Cube001.geometry} material={materials["Black marble"]} />
            <mesh castShadow receiveShadow geometry={nodes.Cube001_1.geometry} material={materials.Chrome} />
            <HintHotspot
              position={[0, 0, 0]}
              isFirstPerson={props.isFirstPerson}
              icon={"🪑"}
              label={"Cambia Tavolo"}
              onClick={props.onShowTableUI}
              pulse={true}
              description={"Clicca per cambiare stile tavolo"}
              uiVisible={props.uiVisible}
            />
          </group>
        ) : (
          <group position={[-0.357, 3.316, -3.268]} rotation={[0, -1.571, 0]}>
            <mesh castShadow receiveShadow geometry={nodes.Cube007.geometry} material={materials.Black} />
            <mesh castShadow receiveShadow geometry={nodes.Cube007_1.geometry} material={materials.Incontrol_75_Top} />
            <mesh castShadow receiveShadow geometry={nodes.Cube007_2.geometry} material={materials.Material} />
            <HintHotspot
              position={[0, 0, 0]}
              isFirstPerson={props.isFirstPerson}
              icon={"🪑"}
              label={"Cambia Tavolo"}
              onClick={props.onShowTableUI}
              pulse={true}
              description={"Clicca per cambiare stile tavolo"}
              uiVisible={props.uiVisible}
            />
          </group>
        )}

        {/* Interior frames/panels */}
        <group position={[1.452, 3.31, -0.608]} rotation={[0, -1.571, 0]}>
          <mesh castShadow receiveShadow geometry={nodes.Plane004.geometry} material={materials.Fabric_grey} />
          <mesh castShadow receiveShadow geometry={nodes.Plane004_1.geometry} material={materials["Wood Black UA"]} />
        </group>
        <group position={[1.452, 3.31, 0.185]} rotation={[0, -1.571, 0]}>
          <mesh castShadow receiveShadow geometry={nodes.Plane004.geometry} material={materials.Fabric_grey} />
          <mesh castShadow receiveShadow geometry={nodes.Plane004_1.geometry} material={materials["Wood Black UA"]} />
        </group>
        <group position={[0.566, 3.31, 0.188]} rotation={[0, 1.571, 0]}>
          <mesh castShadow receiveShadow geometry={nodes.Plane004.geometry} material={materials.Fabric_grey} />
          <mesh castShadow receiveShadow geometry={nodes.Plane004_1.geometry} material={materials["Wood Black UA"]} />
        </group>
        <group position={[0.566, 3.31, -0.606]} rotation={[0, 1.571, 0]}>
          <mesh castShadow receiveShadow geometry={nodes.Plane004.geometry} material={materials.Fabric_grey} />
          <mesh castShadow receiveShadow geometry={nodes.Plane004_1.geometry} material={materials["Wood Black UA"]} />
        </group>

        {/* Sofa variants with hotspot */}
        {showSofaA ? (
          <group position={[-1.395, 3.308, -3.508]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.SofaA.geometry}
              material={materials.SofaA}
              position={[0.755, 0.45, -2.24]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.SofaA_Legs.geometry}
              material={materials.BlackPlasticGlossy}
            />
            <HintHotspot
              position={[0, 0, 0]}
              isFirstPerson={props.isFirstPerson}
              icon={"🛋️"}
              label={"Cambia Divano"}
              onClick={props.onShowSofaUI}
              pulse={true}
              description={"Clicca per cambiare stile divano"}
              uiVisible={props.uiVisible}
            />
          </group>
        ) : (
          <group position={[-1.42, 3.309, -3.859]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.SofaB.geometry}
              material={materials.SofaB}
              position={[-0.049, 0.171, 0.286]}
            />
            <mesh castShadow receiveShadow geometry={nodes.SofaB_Legs.geometry} material={materials.Base} />
            <group position={[0.707, 0.658, -1.499]} rotation={[0.044, -1.334, -1.359]}>
              <mesh castShadow receiveShadow geometry={nodes.Plane002.geometry} material={materials.PillowA} />
              <mesh castShadow receiveShadow geometry={nodes.Plane002_1.geometry} material={materials.PillowB} />
              <mesh castShadow receiveShadow geometry={nodes.Plane002_2.geometry} material={materials.PillowC} />
            </group>
            <HintHotspot
              position={[0.5, 1.2, -1.2]}
              isFirstPerson={props.isFirstPerson}
              icon={"🛋️"}
              label={"Cambia Divano"}
              onClick={props.onShowSofaUI}
              pulse={true}
              description={"Clicca per cambiare stile divano"}
              uiVisible={props.uiVisible}
            />
          </group>
        )}

        {/* Roof/canopy + fixtures */}
        <group position={[0, 5.471, -2.79]}>
          <mesh castShadow receiveShadow geometry={nodes.Plane001.geometry} material={materials.Plastic_matte_white} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_1.geometry} material={materials.Plastic_glossy_white} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_2.geometry} material={materials.Fill_holes} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_3.geometry} material={materials.Fabric_nero} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_4.geometry} material={materials.Emissive} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_5.geometry} material={materials.Chrome} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_6.geometry} material={materials.BlackPlasticGlossy} />
          <mesh castShadow receiveShadow geometry={nodes.Plane001_7.geometry} material={materials.TendaParasole} />
        </group>
        <group position={[-1.631, 3.308, -0.76]}>
          <mesh castShadow receiveShadow geometry={nodes.Cube037.geometry} material={materials.Wood} />
          <mesh castShadow receiveShadow geometry={nodes.Cube037_1.geometry} material={materials.Chrome} />
        </group>
        <group position={[1.023, 3.308, -0.17]}>
          <mesh castShadow receiveShadow geometry={nodes.Cube011.geometry} material={materials["Black marble"]} />
          <mesh castShadow receiveShadow geometry={nodes.Cube011_1.geometry} material={materials.Chrome} />
        </group>
        <group position={[1.009, 4.058, -0.135]} rotation={[Math.PI, 0, Math.PI]} scale={0.56}>
          <mesh castShadow receiveShadow geometry={nodes.Cylinder008.geometry} material={materials.Ceramica_rossa} />
          <mesh castShadow receiveShadow geometry={nodes.Cylinder008_1.geometry} material={materials.Ceramica_gialla} />
          <mesh castShadow receiveShadow geometry={nodes.Cylinder008_2.geometry} material={materials.Ceramica_arancio} />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.VaseTableSmall.geometry}
          material={materials.Ceramica_arancio}
          position={[-0.493, 3.681, -3.547]}
        />

        {/* Additional glass and interior accents from full model */}
        <group position={[-1.705, 4.325, -5.057]} rotation={[Math.PI, -1.566, Math.PI]}>
          <mesh castShadow receiveShadow geometry={nodes.Plane020.geometry} material={materials["Cover book-03"]} />
          <mesh castShadow receiveShadow geometry={nodes.Plane020_1.geometry} material={materials.paper} />
          <mesh castShadow receiveShadow geometry={nodes.Plane020_2.geometry} material={materials["Cover book-02"]} />
          <mesh castShadow receiveShadow geometry={nodes.Plane020_3.geometry} material={materials["Cover book-01"]} />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005.geometry}
          material={materials.Glass}
          position={[-1.451, 4.363, 0.383]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube016.geometry}
          material={materials.BlackPlasticGlossy}
          position={[0, 6.038, -0.581]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017.geometry}
          material={materials.Chrome}
          position={[-1.483, 4.288, 0.375]}
        />
        <group position={[-1.071, 4.553, 2.219]}>
          <mesh castShadow receiveShadow geometry={nodes.Cube025_1.geometry} material={materials.Display} />
          <mesh castShadow receiveShadow geometry={nodes.Cube025_2.geometry} material={materials.BlackPlasticGlossy} />
          <mesh castShadow receiveShadow geometry={nodes.Cube025_3.geometry} material={materials.Chrome} />
          <mesh castShadow receiveShadow geometry={nodes.Cube025_4.geometry} material={materials.panels_plastics} />
          <mesh castShadow receiveShadow geometry={nodes.Cube025_5.geometry} material={materials.Fabric_nero} />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Glass.geometry}
          material={materials.Glass}
          position={[1.268, 3.569, -4.848]}
          rotation={[-Math.PI, 0, -Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Ground.geometry}
          material={materials.Carpet}
          position={[1.138, 3.302, -5.702]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Ground001.geometry}
          material={materials.Chrome}
          position={[1.138, 3.302, -5.702]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <group position={[-0.222, 1.217, 13.001]}>
          <mesh castShadow receiveShadow geometry={nodes.Mesh005.geometry} material={materials.Glass} />
          <mesh castShadow receiveShadow geometry={nodes.Mesh005_1.geometry} material={materials.GlassBlack} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/Riva88Folgore_9.glb");

export default Model;

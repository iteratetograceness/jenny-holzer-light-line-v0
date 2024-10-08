/**
 * Generated by v0: https://v0.dev/chat/-V1wnLTugT-
 */

'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface ScrollingLedSignProps {
  text: string
}

export function ScrollingLedSign({ text }: ScrollingLedSignProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange)

    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_resolution: { value: new THREE.Vector2() },
        u_time: { value: 0 },
        u_texture: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform sampler2D u_texture;
        varying vec2 vUv;

        float circle(in vec2 _st, in float _radius) {
          vec2 dist = _st - vec2(0.5);
          return 1.0 - smoothstep(_radius - (_radius * 0.01),
                                  _radius + (_radius * 0.01),
                                  dot(dist, dist) * 4.0);
        }

        void main() {
          vec2 st = vUv;
          st.x = fract(st.x - u_time * 0.1); // Scrolling effect
          st *= vec2(400.0, 40.0); // Adjusted for better aspect ratio
          
          vec2 ipos = floor(st);
          vec2 fpos = fract(st);

          float c = circle(fpos, 0.4);
          
          vec4 color = texture2D(u_texture, vec2(st.x / 400.0, st.y / 40.0));
          float brightness = (color.r + color.g + color.b) / 3.0;
          
          vec3 ledColor = vec3(1.0, 0.6, 0.0); // Orange color
          vec3 finalColor = ledColor * brightness * c;
          
          // Add a slight glow effect
          finalColor += ledColor * brightness * 0.3;

          // Add some noise to simulate imperfect LEDs
          float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
          finalColor *= 0.9 + 0.1 * noise;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const resize = () => {
      if (!containerRef.current || !canvasRef.current) return

      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      // Set canvas size to match container
      const rectWidth = containerWidth
      const rectHeight = containerHeight

      renderer.setSize(rectWidth, rectHeight)
      material.uniforms.u_resolution.value.x = rectWidth
      material.uniforms.u_resolution.value.y = rectHeight

      // Remove absolute positioning
      canvasRef.current.style.position = 'relative'
      canvasRef.current.style.left = '0'
      canvasRef.current.style.top = '0'

      // Adjust the camera
      const aspect = rectWidth / rectHeight
      const frustumHeight = 1
      const frustumWidth = frustumHeight * aspect
      camera.left = -frustumWidth / 2
      camera.right = frustumWidth / 2
      camera.top = frustumHeight / 2
      camera.bottom = -frustumHeight / 2
      camera.updateProjectionMatrix()

      mesh.scale.set(aspect, 1, 1)
    }

    const createTextTexture = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      const fontSize = 100
      const padding = 20
      const letterSpacing = 10
      const spaceBetweenTexts = 100
      ctx.font = `bold ${fontSize}px Arial`
      const textWidth = ctx.measureText(text.toUpperCase()).width + 50
      const totalWidth =
        textWidth + (text.length - 1) * letterSpacing + padding * 2

      canvas.width = totalWidth
      canvas.height = fontSize + padding * 2

      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `bold ${fontSize}px Arial`
      ctx.fillStyle = 'white'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      const drawText = (startX: number) => {
        let x = startX
        const y = canvas.height * 0.55
        const upperCaseText = text.toUpperCase()

        for (let i = 0; i < upperCaseText.length; i++) {
          ctx.fillText(upperCaseText[i], x, y)
          x += ctx.measureText(upperCaseText[i]).width + letterSpacing
        }
      }

      drawText(padding)
      drawText(totalWidth + padding + spaceBetweenTexts)

      return new THREE.CanvasTexture(canvas)
    }

    const updateText = () => {
      const texture = createTextTexture()
      if (texture) {
        material.uniforms.u_texture.value = texture
      }
    }

    const animate = () => {
      requestAnimationFrame(animate)
      if (!prefersReducedMotion.current) {
        material.uniforms.u_time.value += 0.01 // Scrolling speed
      }
      renderer.render(scene, camera)
    }

    resize()
    updateText()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      renderer.dispose()
    }
  }, [text])

  return (
    <div ref={containerRef} className='w-full h-16'>
      <canvas ref={canvasRef} />
    </div>
  )
}

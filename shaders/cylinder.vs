
precision mediump float;

// Built-in attributes
attribute vec4 a_position;
attribute vec2 a_texCoord;

// Built-in uniforms
uniform mat4 u_projectionMatrix;

// Uniforms passed in from CSS
uniform float amount;
uniform float radius;
uniform mat4 transform;

// Varyings
varying vec4 v_color;
varying float v_light;

// Constants
const float PI = 3.1415;

// Compute cylindrical coordinates based on UVs
vec3 computeCylinder( vec2 uv, float r ) {
	vec3 p;
	float fi = (uv.x + 0.5) * 2.0 * PI;

	p.x = r * sin(fi) * 0.5;
	p.y = (uv.y - 0.5);
	p.z = r * cos(fi);
	return p;

}

// Main
void main() {
	vec4 position = a_position;

	// Compute cylinder using UV coordinates
	vec3 cylinder = computeCylinder( a_texCoord, radius );

	// Blend plane and cylinder
	position.xyz = mix( position.xyz, cylinder, amount );
	
   	vec3 vertexNormal = position.xyz;
	   	vertexNormal.y = 0.0;
	   	vertexNormal = normalize(vertexNormal);
   	
   	vec3 normal = vec3(0.0, 0.0, 1.0);
   	normal = mix(normal, vertexNormal, amount);
   	
   	vec3 lightPos = vec3(0.0, 0.0, 1.0);
   	float dot = max(dot(normal, lightPos), 0.5);
    	
    float light = dot;
    	
    v_light = light;
    	
    v_color = vec4(a_texCoord.x, a_texCoord.y, 0.0, 1.0);

	// Set vertex position
	gl_Position = u_projectionMatrix * transform * position;
}
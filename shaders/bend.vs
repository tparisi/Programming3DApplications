precision mediump float;
 
attribute vec4 a_position;
attribute vec2 a_texCoord;
 
uniform mat4 u_projectionMatrix;
varying vec4 v_color;
varying float v_light;

uniform vec3 cameraPosition;
uniform vec3 lightPosition;
uniform float bendAmount;

const float PI = 3.1415;

// Construct perspective matrix
mat4 perspectiveCamera() {

	return mat4(2.41421, 0.0, 0.0, 0.0,
	            0.0, 2.41421, 0.0, 0.0,
	            0.0, 0.0, -1.002002, -1.0, 
	            0.0, 0.0, -0.2002002, 0.0);

}

mat4 modelView() {

	return mat4(1.0, 0.0, 0.0, 0.0,
	            0.0, 1.0, 0.0, 0.0,
	            0.0, 0.0, 1.0, 0.0, 
	            -cameraPosition.x, -cameraPosition.y, -cameraPosition.z, 1.0);

}

void main()
{
    vec4 position = a_position;
    float r = 1.0;
    float theta = PI / 2.0 * bendAmount;
	
	vec3 vertexNormal;
   	vertexNormal=vec3(0.0, 0.0, 1.0);
    if (a_texCoord.x >= 0.5)
    {
	    position.x *= cos(theta);
		position.z *= -cos(theta);
	
		vec3 normal = vertexNormal;
		normal.x *= cos(theta);
		normal.z *= cos(theta);
		vertexNormal = mix(vertexNormal, normal, bendAmount);
	}

	vec3 lightPositionNormalized = normalize( lightPosition );
    float light = max( dot( vertexNormal, lightPositionNormalized ), 0.5 );
    
    v_light = light;
    
    gl_Position = u_projectionMatrix * perspectiveCamera() * modelView() * position;
    v_color = vec4(a_texCoord.x, a_texCoord.y, 0, 1);
}
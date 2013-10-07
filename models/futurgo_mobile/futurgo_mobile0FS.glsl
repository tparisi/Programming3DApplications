precision highp float;
varying vec3 v_normal;
uniform vec3 u_light0Color;
varying vec3 v_light0Direction;
uniform vec3 u_light1Color;
varying vec3 v_light1Direction;
uniform vec3 u_light2Color;
varying vec3 v_light2Direction;
uniform vec4 u_ambient;
uniform vec4 u_diffuse;
uniform vec4 u_emission;
void main(void) {
vec3 normal = normalize(v_normal);
if (gl_FrontFacing == false) normal = -normal;
vec4 color = vec4(0., 0., 0., 0.);
vec4 diffuse = vec4(0., 0., 0., 1.);
vec3 diffuseLight = vec3(0., 0., 0.);
vec4 emission;
vec4 ambient;
vec3 ambientLight = vec3(0., 0., 0.);
{
float diffuseIntensity;
float specularIntensity;
diffuseIntensity = max(dot(normal,normalize(v_light0Direction)), 0.);
diffuseLight += u_light0Color * diffuseIntensity;
}
{
float diffuseIntensity;
float specularIntensity;
diffuseIntensity = max(dot(normal,normalize(v_light1Direction)), 0.);
diffuseLight += u_light1Color * diffuseIntensity;
}
{
float diffuseIntensity;
float specularIntensity;
diffuseIntensity = max(dot(normal,normalize(v_light2Direction)), 0.);
diffuseLight += u_light2Color * diffuseIntensity;
}
ambient = u_ambient;
diffuse = u_diffuse;
emission = u_emission;
ambient.xyz *= ambientLight;
color.xyz += ambient.xyz;
diffuse.xyz *= diffuseLight;
color.xyz += diffuse.xyz;
color.xyz += emission.xyz;
color = vec4(color.rgb * diffuse.a, diffuse.a);
gl_FragColor = color;
}

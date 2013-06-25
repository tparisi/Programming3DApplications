// passthrough.fs
precision mediump float;

varying vec4 v_color; 
varying float v_light;

void main()
{
	vec4 color = v_color;
	if (v_light >= 0.0)
		color = vec4(v_light, v_light, v_light, 1.0);
		
    if (gl_FrontFacing) {
	 css_ColorMatrix = mat4( color.r, 0.0, 0.0, 0.0,
							0.0, color.g, 0.0, 0.0,
							0.0, 0.0, color.b, 0.0,
							0.0, 0.0, 0.0, color.a );
    }
    else
    {
		css_ColorMatrix = mat4( 0.0, 0.0, 0.0, 0.0,
							0.0, 0.0, 0.0, 0.0,
							0.0, 0.0, 0.0, 0.0,
							0.0, 0.0, 0.0, 1.0 );
	}
}
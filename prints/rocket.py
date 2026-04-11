#!/usr/bin/env python3
"""
Generate a simple rocket ship 3D model for 3D printing
"""
import subprocess
import os

scad_code = '''
// Rocket Ship - Odin's 3D Prints
// Simple rocket with fins and nose cone

// Parameters
rocket_length = 60;
rocket_radius = 15;
nose_radius = 15;
fins = 3;
fin_height = 20;
fin_thickness = 3;

module rocket_body() {
    // Main body - cylinder
    cylinder(h=rocket_length * 0.7, r=rocket_radius, center=false);
}

module nose_cone() {
    // Nose cone using sphere section
    translate([0, 0, rocket_length * 0.7])
    intersection() {
        sphere(r=nose_radius);
        translate([0, 0, -nose_radius])
        cube([nose_radius*2, nose_radius*2, nose_radius]);
    }
}

module fin() {
    // Single fin
    translate([0, -fin_thickness/2, 0])
    linear_extrude(height=fin_thickness)
    polygon(points=[
        [rocket_radius, 0],
        [rocket_radius + 15, fin_height],
        [rocket_radius, fin_height * 0.8]
    ]);
}

module engine() {
    // Engine nozzle at bottom
    translate([0, 0, -10])
    cylinder(h=10, r1=8, r2=12, center=false);
}

module rocket() {
    difference() {
        union() {
            rocket_body();
            nose_cone();
            engine();
            // Fins
            for (i = [0: fins-1]) {
                rotate([0, 0, i * 360 / fins])
                translate([rocket_radius - 2, 0, rocket_length * 0.2])
                fin();
            }
        }
        // Hollow out the body
        translate([0, 0, rocket_length * 0.7 + 5])
        cylinder(h=rocket_length * 0.6, r=rocket_radius - 3, center=false);
    }
}

// Center and output
rocket();
'''

# Write the .scad file
with open('prints/rocket.scad', 'w') as f:
    f.write(scad_code)

print("Rocket SCAD file created")

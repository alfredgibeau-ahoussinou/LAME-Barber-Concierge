#!/usr/bin/env ruby
# ═══════════════════════════════════════════════════════════════
#  add-fonts-to-xcode.rb
#  Ajoute les fichiers .ttf au projet Xcode automatiquement
#  Usage : ruby add-fonts-to-xcode.rb LAME
# ═══════════════════════════════════════════════════════════════

require 'xcodeproj'

APP_NAME = ARGV[0] || 'BladeBarber'
PROJECT_PATH = "ios/#{APP_NAME}.xcodeproj"
FONTS_DIR = "ios/#{APP_NAME}/Fonts"
TARGET_NAME = APP_NAME

FONTS = %w[
  CormorantGaramond-Light.ttf
  CormorantGaramond-Regular.ttf
  CormorantGaramond-LightItalic.ttf
  DMSans-Regular.ttf
  DMSans-Light.ttf
  DMSans-Medium.ttf
]

unless File.exist?(PROJECT_PATH)
  puts "✗ Projet Xcode introuvable : #{PROJECT_PATH}"
  puts "  Vérifie que APP_NAME est correct (arg 1)"
  exit 1
end

project = Xcodeproj::Project.open(PROJECT_PATH)
target  = project.targets.find { |t| t.name == TARGET_NAME }

unless target
  puts "✗ Target '#{TARGET_NAME}' introuvable"
  puts "  Targets disponibles : #{project.targets.map(&:name).join(', ')}"
  exit 1
end

# Trouver ou créer le groupe Fonts
main_group  = project.main_group
app_group   = main_group.children.find { |g| g.display_name == APP_NAME }
fonts_group = app_group&.children&.find { |g| g.display_name == 'Fonts' }

unless fonts_group
  fonts_group = (app_group || main_group).new_group('Fonts', 'Fonts')
  puts "✓ Groupe 'Fonts' créé dans Xcode"
end

# Phase de ressources (Copy Bundle Resources)
resources_phase = target.resources_build_phase

added = 0
FONTS.each do |font|
  path = "#{FONTS_DIR}/#{font}"

  unless File.exist?(path)
    puts "⚠ Font manquante : #{font} (télécharge-la manuellement)"
    next
  end

  # Ne pas ajouter si déjà présente
  already = fonts_group.children.any? { |f| f.display_name == font }
  if already
    puts "  → #{font} déjà dans le projet"
    next
  end

  # Ajouter la référence au projet
  file_ref = fonts_group.new_file(path)

  # Ajouter à la phase Copy Bundle Resources
  resources_phase.add_file_reference(file_ref)

  puts "✓ #{font} ajouté au projet"
  added += 1
end

project.save
puts ""
puts "✓ #{added} fonts ajoutées au projet Xcode"
puts "  Recompile avec : npx react-native run-ios"

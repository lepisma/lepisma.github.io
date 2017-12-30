module Jekyll
  class ImageLinkBlock < Liquid::Block

    def initialize(tag_name, markup, tokens)
      super
    end

    def render(context)
      # First line is image url
      # Second is link
      contents = super
      lines = contents.split("\n").select { |l| l.strip != "" }

      img = "<img src='#{lines[0].strip}'>"
      if lines.length > 1
        "<a class='image-link' href='#{lines[1].strip}'>#{img}</a>"
      else
        img
      end
    end
  end
end

Liquid::Template.register_tag('image_link', Jekyll::ImageLinkBlock)

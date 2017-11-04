Jekyll::Hooks.register :pages, :post_init do |page|
  if page.path.start_with? "sticky"
    page.data['update_date'] = File.mtime(page.path)
  end
end

class Scraper

  def self.get_usa_book_list
    Nokogiri::HTML(open("https://www.usatoday.com/life/books/best-selling/"))
  end

  def self.generate_page_count
    (180..350).to_a.sample
  end

  def self.scrape_usa_book_list
    get_usa_book_list.css('div.front-booklist-info-container').collect do |book_listing|
      {title: book_listing.css('h3.books-front-meta-title').text.strip,
      author: book_listing.css("span.books-front-meta-authorInfo").text.strip,
      genre: book_listing.css('div.books-front-meta-genre').text.strip.gsub!('Genre:', ''),
      page_count: Scraper.generate_page_count
      }
    end
  end

  def self.create_and_collect_usa_books
    scraper = self.scrape_usa_book_list
    scraper.each do |book_hash|
      Book.create(book_hash)
    end
  end


end
# Factory Transpiler

![Badge](https://img.shields.io/badge/Factory-2.3-blue)

### supports

-   conversion from factory to html
    -   normal tags, singletons and text
-   auto formatting
-   error detection

# Syntax

```css
meta(charset="UTF-8")
div(a="a") {
    div(b="b") {
        div(c="c" test) {
            "text"
            auto-formated() {

            }
        }
    }
    button(class="rounded") {
        "Click Me"
    }
}
div(a="b" *ngIf="showHello") {
    "hello"
    br()
    img(src="picture.png")
}
```

# Output

```html
<meta charset="UTF-8" />
<div a="a">
    <div b="b">
        <div c="c" test>
            text
            <auto-formated> </auto-formated>
        </div>
    </div>
    <button class="rounded">Click Me</button>
</div>
<div a="b" *ngIf="showHello">
    hello
    <br />
    <img src="picture.png" />
</div>
```
